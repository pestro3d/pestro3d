import { adminOrders } from "@/lib/admin-data";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default function AdminPage() {
  return <AdminDashboardClient initialOrders={adminOrders} />;
}
