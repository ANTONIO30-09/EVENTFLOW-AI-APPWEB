export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d131f] text-brand-porcelain flex">
      <aside className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold text-brand-bronze mb-8">EventFlow Admin</h2>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
