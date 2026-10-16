import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/store-data";
import { products as seededProducts } from "@/lib/store-data";

export async function getCatalogProducts(): Promise<Product[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return seededProducts.filter((product) => product.isActive !== false);
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client
    .from("products")
    .select("slug,name,category,tagline,description,base_price_inr,images,product_options(id,option_type,label,price_delta_inr)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load the product catalog from Supabase: ${error.message}`);
  }

  return data.map((row) => {
    const fallback = seededProducts.find((product) => product.slug === row.slug);
    const basePrice = row.base_price_inr;
    const savedOptions = row.product_options ?? [];

    return {
      slug: row.slug,
      name: row.name,
      category: row.category,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
      basePrice,
      featuredNote: fallback?.featuredNote ?? "",
      image: row.images?.[0] || fallback?.image || "",
      imageAlt: fallback?.imageAlt || row.name,
      variants: savedOptions.length
        ? savedOptions.map((option) => ({
            id: option.id,
            label: option.label,
            size: option.option_type === "size" ? option.label : "",
            optionType: option.option_type,
            price: basePrice + option.price_delta_inr,
            turnaround: "",
          }))
        : fallback?.variants ?? [],
      reviews: fallback?.reviews ?? [],
      faqs: fallback?.faqs ?? [],
    };
  });
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  const catalog = await getCatalogProducts();
  return catalog.find((product) => product.slug === slug);
}
