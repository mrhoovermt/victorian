import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminNav />
      <main className="flex-1 ml-60 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
