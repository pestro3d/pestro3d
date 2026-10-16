"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/store-data";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type ProductOptionType = "size" | "finish" | "addon";
type ProductOptionDraft = {
  label: string;
  type: ProductOptionType;
  price: string;
};

const emptyForm = () => ({
  slug: "",
  name: "",
  category: "",
  tagline: "",
  description: "",
  basePrice: "",
  featuredNote: "",
  image: "",
  imageAlt: "",
  isActive: true,
  options: [{ label: "", type: "size" as ProductOptionType, price: "" }],
});

interface ProductsDashboardClientProps {
  initialProducts: Product[];
}

export default function ProductsDashboardClient({ initialProducts }: ProductsDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const loadProducts = async () => {
      const { data, error } = await getSupabaseClient()
        .from("products")
        .select("slug,name,category,tagline,description,base_price_inr,featured_note,images,image_alt,is_active,product_options(id,option_type,label,price_delta_inr)")
        .order("sort_order", { ascending: true });

      if (!isMounted) return;
      if (error) {
        setErrorMessage(`Could not load products from Supabase: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data) {
        setProducts(data.map((row) => {
          const savedOptions = row.product_options ?? [];
          const fallback = initialProducts.find((product) => product.slug === row.slug);
          const basePrice = row.base_price_inr;
          return {
            slug: row.slug,
            name: row.name,
            category: row.category,
            tagline: row.tagline ?? "",
            description: row.description ?? "",
            basePrice,
            featuredNote: row.featured_note ?? fallback?.featuredNote ?? "",
            image: row.images?.[0] ?? "",
            imageAlt: row.image_alt || fallback?.imageAlt || row.name,
            isActive: row.is_active,
            variants: savedOptions.length ? savedOptions.map((option) => ({
              id: option.id,
              label: option.label,
              size: option.option_type === "size" ? option.label : "",
              optionType: option.option_type,
              price: basePrice + option.price_delta_inr,
              turnaround: "",
            })) : fallback?.variants ?? [],
            reviews: fallback?.reviews ?? [],
            faqs: fallback?.faqs ?? [],
          };
        }));
      }
      setIsLoading(false);
    };

    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  const handleCreateNew = () => {
    setFormData(emptyForm());
    setImageFile(null);
    setErrorMessage("");
    setEditingProduct(null);
    setIsCreating(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      slug: product.slug,
      name: product.name,
      category: product.category,
      tagline: product.tagline,
      description: product.description,
      basePrice: product.basePrice.toString(),
      featuredNote: product.featuredNote,
      image: product.image,
      imageAlt: product.imageAlt,
      isActive: product.isActive !== false,
      options: product.variants.map<ProductOptionDraft>((v) => ({
        label: v.label,
        type: v.optionType ?? (v.size ? "size" : "addon"),
        price: v.price.toString(),
      })),
    });
    setImageFile(null);
    setErrorMessage("");
    setEditingProduct(product);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase is not configured. Add the public Supabase URL and anon key before saving products.");
      return;
    }

    const basePrice = Number(formData.basePrice);
    if (!Number.isInteger(basePrice) || basePrice < 0) {
      setErrorMessage("Enter a valid base price in whole rupees.");
      return;
    }
    const options = formData.options.filter((option) => option.label.trim() || option.price);
    if (!options.length) {
      setErrorMessage("Add at least one size, finish, or add-on option before saving.");
      return;
    }
    if (options.some((option) => !option.label.trim() || !Number.isInteger(Number(option.price)) || Number(option.price) < 0)) {
      setErrorMessage("Complete each product option with a label and a valid price in whole rupees.");
      return;
    }

    setIsSaving(true);
    try {
      const client = getSupabaseClient();
      let imageUrl = formData.image.trim();

      if (imageFile) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const imagePath = `${formData.slug}/${Date.now()}-${safeFileName}`;
        const { error: uploadError } = await client.storage
          .from("product-images")
          .upload(imagePath, imageFile, { upsert: false });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        imageUrl = client.storage.from("product-images").getPublicUrl(imagePath).data.publicUrl;
      }

      const productValues = {
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        category: formData.category.trim(),
        tagline: formData.tagline.trim() || null,
        description: formData.description.trim() || null,
        base_price_inr: basePrice,
        featured_note: formData.featuredNote.trim(),
        images: imageUrl ? [imageUrl] : [],
        image_alt: formData.imageAlt.trim() || formData.name.trim(),
        is_active: formData.isActive,
      };
      const { data: savedProduct, error: productError } = await client
        .from("products")
        .upsert(productValues, { onConflict: "slug" })
        .select("slug")
        .single();
      if (productError) throw new Error(`Could not save product: ${productError.message}`);

      const { data: productRow, error: productLookupError } = await client
        .from("products")
        .select("id")
        .eq("slug", savedProduct.slug)
        .single();
      if (productLookupError) {
        throw new Error(`Product saved, but its options could not be loaded: ${productLookupError.message}`);
      }

      const { error: removeOptionsError } = await client
        .from("product_options")
        .delete()
        .eq("product_id", productRow.id);
      if (removeOptionsError) {
        throw new Error(`Product saved, but old options could not be updated: ${removeOptionsError.message}`);
      }
      if (options.length) {
        const { error: optionsError } = await client.from("product_options").insert(
          options.map((option, index) => ({
            product_id: productRow.id,
            option_type: option.type,
            label: option.label.trim(),
            price_delta_inr: Number(option.price) - basePrice,
            sort_order: index,
          }))
        );
        if (optionsError) {
          throw new Error(`Product saved, but its options could not be saved: ${optionsError.message}`);
        }
      }

      const newProduct: Product = {
        slug: productValues.slug,
        name: productValues.name,
        category: productValues.category,
        tagline: productValues.tagline ?? "",
        description: productValues.description ?? "",
        basePrice,
        featuredNote: formData.featuredNote.trim(),
        image: imageUrl,
        imageAlt: formData.imageAlt.trim() || productValues.name,
        isActive: formData.isActive,
        variants: options.map((option, index) => ({
          id: `${productValues.slug}-${index}`,
          label: option.label.trim(),
          size: option.type === "size" ? option.label.trim() : "",
          optionType: option.type,
          price: Number(option.price),
          turnaround: "",
        })),
        reviews: editingProduct?.reviews ?? [],
        faqs: editingProduct?.faqs ?? [],
      };

      setProducts((current) => editingProduct
        ? current.map((product) => product.slug === editingProduct.slug ? newProduct : product)
        : [...current, newProduct]);
      setIsCreating(false);
      setEditingProduct(null);
      setImageFile(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred while saving the product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setErrorMessage("");
    try {
      const { error } = await getSupabaseClient().from("products").delete().eq("slug", slug);
      if (error) throw new Error(`Could not delete product: ${error.message}`);
      setProducts((current) => current.filter((product) => product.slug !== slug));
      setShowDeleteConfirm(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred while deleting the product.");
      setShowDeleteConfirm(null);
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { label: "", type: "size", price: "" }],
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, field: keyof ProductOptionDraft, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => {
        if (i !== index) return option;
        if (field === "type") {
          const type: ProductOptionType = value === "finish" || value === "addon" ? value : "size";
          return { ...option, type };
        }
        return { ...option, [field]: value };
      }),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Admin / Products</p>
          <h1 className="mt-2 text-4xl font-display text-[#4c1c5c]">Product Management</h1>
        </div>
        <button
          onClick={handleCreateNew}
          className="rounded-full bg-[#4c1c5c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6a2c8c] transition-colors self-start"
        >
          + Add Product
        </button>
      </div>
      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}
      {!isSupabaseConfigured && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase is not configured. Product changes cannot be saved until environment variables are set.
        </p>
      )}

      {/* Products Grid */}
      {!isCreating ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="col-span-full text-sm text-[var(--color-muted)]">Loading products…</p>}
          {products.map((product) => (
            <article key={product.slug} className="group overflow-hidden rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium">{product.category}</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl text-[#4c1c5c]">{product.name}</h3>
                    <p className="text-xs text-[var(--color-muted)]">{product.slug}</p>
                  </div>
                  <span className="text-lg font-semibold text-[#4c1c5c]">₹{product.basePrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2">{product.tagline}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive === false ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-800"}`}>
                  {product.isActive === false ? "Draft" : "Published"}
                </span>
                <div className="flex flex-wrap gap-1">
                  {product.variants.slice(0, 3).map((v) => (
                    <span key={v.id} className="text-xs px-2 py-0.5 rounded-full border border-[#d4c4e8] text-[var(--color-muted)]">
                      {v.label}
                    </span>
                  ))}
                  {product.variants.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full border border-[#d4c4e8] text-[var(--color-muted)]">
                      +{product.variants.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#d4c4e8]/50">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-sm font-medium text-[#4c1c5c] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(product.slug)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!isLoading && products.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-[var(--color-muted)] mb-4">No products yet</p>
              <button onClick={handleCreateNew} className="rounded-full bg-[#4c1c5c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6a2c8c]">
                Create First Product
              </button>
            </div>
          )}
        </div>
      ) : (
        // Product Form
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display text-[#4c1c5c]">
                {editingProduct ? "Edit Product" : "Create Product"}
              </h2>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingProduct(null); }}
                className="text-[var(--color-muted)] hover:text-[#4c1c5c] text-xl"
              >
                ✕
              </button>
            </div>

            {/* Basic Info */}
            <fieldset className="space-y-4 rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 p-5">
              <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Basic Information</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    disabled={Boolean(editingProduct)}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c] disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="miniature-portrait"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="Miniature Portrait"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="Custom Keepsake"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="4000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                  placeholder="Cherished moments, immortalized in miniature."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Featured Note</label>
                <input
                  type="text"
                  value={formData.featuredNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredNote: e.target.value }))}
                  className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                  placeholder="Preview before production • Hand-painted finish • 4-inch scale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c] resize-y"
                  placeholder="Transform your favorite photograph into an exquisite hand-painted resin miniature..."
                />
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-[#4c1c5c]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 accent-[#4c1c5c]"
                />
                Publish product in the store
              </label>
            </fieldset>

            {/* Images */}
            <fieldset className="space-y-4 rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 p-5">
              <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Images</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Main Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setImageFile(null);
                      setFormData(prev => ({ ...prev, image: e.target.value }));
                    }}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="/images/bike-miniature-1.jpg"
                    required={!imageFile}
                  />
                  <p className="mt-1 text-xs text-[var(--color-muted)]">Use an existing image URL, or upload an image below.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="Hand-painted bike miniature"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Upload Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-[#4c1c5c] file:mr-4 file:rounded-full file:border-0 file:bg-[#f4ecfa] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#4c1c5c]"
                  />
                  {imageFile && <p className="mt-1 text-xs text-[var(--color-muted)]">Selected: {imageFile.name}</p>}
                </div>
              </div>
              {formData.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-[#d4c4e8] bg-white">
                  <Image
                    src={formData.image}
                    alt={formData.imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              )}
            </fieldset>

            {/* Options */}
            <fieldset className="space-y-4 rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 p-5">
              <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Options & Pricing</legend>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm font-medium text-[#4c1c5c] hover:underline"
                >
                  + Add Option
                </button>
              </div>
              <p className="text-sm text-[var(--color-muted)]">Set customer-selectable sizes, finishes, or add-ons. Prices are final option prices in rupees.</p>
              {formData.options.map((option, index) => (
                <div key={index} className="grid gap-4 border-t border-[#d4c4e8]/50 pt-4 first:border-0 first:pt-0 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Option label</label>
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(index, "label", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder="9 cm / Hand-painted"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Option type</label>
                    <select
                      value={option.type}
                      onChange={(e) => updateOption(index, "type", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    >
                      <option value="size">Size</option>
                      <option value="finish">Finish</option>
                      <option value="addon">Add-on</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Final price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={option.price}
                      onChange={(e) => updateOption(index, "price", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder={formData.basePrice || "4000"}
                      required={Boolean(option.label)}
                    />
                  </div>
                  {formData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="self-end pb-2 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </fieldset>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-[#d4c4e8]/50">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => { setIsCreating(false); setEditingProduct(null); }}
                className="rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-6 py-2 text-sm font-medium text-[#4c1c5c] hover:bg-[#f4ecfa] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                aria-busy={isSaving}
                className="rounded-full bg-[#4c1c5c] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6a2c8c] transition-colors"
              >
                {isSaving ? "Saving…" : editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-display text-[#4c1c5c] mb-2">Delete Product?</h3>
            <p className="text-[var(--color-muted)] mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-4 py-2 text-sm font-medium text-[#4c1c5c] hover:bg-[#f4ecfa]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}