import { products } from "@/lib/store-data";
import ProductsDashboardClient from "@/components/ProductsDashboardClient";

export default function ProductsPage() {
  return <ProductsDashboardClient initialProducts={products} />;
}