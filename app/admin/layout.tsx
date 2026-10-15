import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcf9ff]">
      {/* Admin Sidebar/Navigation */}
      <nav className="border-b border-[#d4c4e8] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-bold text-[#4c1c5c]">
              Pestro3D <span className="text-sm font-normal opacity-60">Admin</span>
            </Link>
            <div className="flex gap-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              <Link href="/admin" className="hover:text-[#4c1c5c] transition-colors">Orders</Link>
              <Link href="/admin/products" className="hover:text-[#4c1c5c] transition-colors">Products</Link>
              <Link href="/admin/discounts" className="hover:text-[#4c1c5c] transition-colors">Discounts</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[#4c1c5c]">View Store</Link>
             <div className="h-8 w-8 rounded-full bg-[#4c1c5c] text-white flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
