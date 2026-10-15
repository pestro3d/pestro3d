import { adminOrders } from "@/lib/admin-data";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import Layout from "@/app/admin/layout";

export default function AdminPage() {
  return (
    <Layout>
      <AdminDashboardClient initialOrders={adminOrders} />
    </Layout>
  );
}
