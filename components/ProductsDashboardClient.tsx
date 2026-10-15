"use client";

import { useState } from "react";
import type { Product } from "@/lib/store-data";
import { products as initialProducts } from "@/lib/store-data";

interface ProductsDashboardClientProps {
  initialProducts: Product[];
}

export default function ProductsDashboardClient({ initialProducts }: ProductsDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form state for new/edited product
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    category: "",
    tagline: "",
    description: "",
    basePrice: "",
    featuredNote: "",
    image: "",
    imageAlt: "",
    variants: [] as { id: string; label: string; size: string; price: string; turnaround: string }[],
  });

  const handleCreateNew = () => {
    setFormData({
      slug: "",
      name: "",
      category: "",
      tagline: "",
      description: "",
      basePrice: "",
      featuredNote: "",
      image: "",
      imageAlt: "",
      variants: [{ id: "", label: "", size: "", price: "", turnaround: "" }],
    });
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
      variants: product.variants.map(v => ({
        id: v.id,
        label: v.label,
        size: v.size,
        price: v.price.toString(),
        turnaround: v.turnaround,
      })),
    });
    setEditingProduct(product);
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      slug: formData.slug,
      name: formData.name,
      category: formData.category,
      tagline: formData.tagline,
      description: formData.description,
      basePrice: parseInt(formData.basePrice) || 0,
      featuredNote: formData.featuredNote,
      image: formData.image,
      imageAlt: formData.imageAlt,
      variants: formData.variants
        .filter(v => v.label && v.size && v.price)
        .map(v => ({
          id: v.id,
          label: v.label,
          size: v.size,
          price: parseInt(v.price) || 0,
          turnaround: v.turnaround,
        })),
      reviews: [],
      faqs: [],
    };

    if (editingProduct) {
      setProducts(current => current.map(p => p.slug === editingProduct.slug ? newProduct : p));
    } else {
      setProducts(current => [...current, newProduct]);
    }

    setIsCreating(false);
    setEditingProduct(null);
  };

  const handleDelete = (slug: string) => {
    setProducts(current => current.filter(p => p.slug !== slug));
    setShowDeleteConfirm(null);
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: "", label: "", size: "", price: "", turnaround: "" }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v),
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

      {/* Products Grid */}
      {!isCreating ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.slug} className="group overflow-hidden rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

          {products.length === 0 && (
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
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Base Price (₹)</label>
                  <input
                    type="number"
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
            </fieldset>

            {/* Images */}
            <fieldset className="space-y-4 rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 p-5">
              <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Images</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Main Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                    placeholder="/images/bike-miniature-1.jpg"
                    required
                  />
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
              </div>
              {formData.image && (
                <div className="aspect-video rounded-lg overflow-hidden border border-[#d4c4e8] bg-white">
                  <img
                    src={formData.image}
                    alt={formData.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </fieldset>

            {/* Variants */}
            <fieldset className="space-y-4 rounded-[1.5rem] border border-[#d4c4e8] bg-white/50 p-5">
              <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Variants</legend>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm font-medium text-[#4c1c5c] hover:underline"
                >
                  + Add Variant
                </button>
              </div>
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-5 border-t border-[#d4c4e8]/50 pt-4 first:border-0 first:pt-0">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Label</label>
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) => updateVariant(index, "label", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder="9 cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Size</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder="9 cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder="4000"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Turnaround</label>
                    <input
                      type="text"
                      value={variant.turnaround}
                      onChange={(e) => updateVariant(index, "turnaround", e.target.value)}
                      className="w-full rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-3 py-2 text-sm text-[#4c1c5c] outline-none focus:border-[#4c1c5c]"
                      placeholder="2-3 weeks"
                    />
                  </div>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="self-end text-red-600 hover:underline text-sm"
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
                onClick={() => { setIsCreating(false); setEditingProduct(null); }}
                className="rounded-[0.75rem] border border-[#d4c4e8] bg-white/50 px-6 py-2 text-sm font-medium text-[#4c1c5c] hover:bg-[#f4ecfa] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#4c1c5c] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6a2c8c] transition-colors"
              >
                {editingProduct ? "Save Changes" : "Create Product"}
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