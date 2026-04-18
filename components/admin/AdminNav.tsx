"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/system-ops" },
  { label: "Contacts", href: "/system-ops/contacts" },
  { label: "Catering Leads", href: "/system-ops/catering" },
  { label: "Taxi Leads", href: "/system-ops/taxi" },
  { label: "Send Email", href: "/system-ops/email" },
  { label: "Send SMS", href: "/system-ops/sms" },
  { label: "Campaign History", href: "/system-ops/campaigns" },
  { label: "Settings", href: "/system-ops/settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/system-ops/login");
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col">
      <div className="p-6 border-b border-[#1a1a1a]">
        <p className="text-[#c9a96e] text-xs tracking-widest uppercase font-sans">Victorian Casino</p>
        <p className="text-gray-600 text-xs font-sans mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = item.href === "/system-ops"
            ? pathname === "/system-ops"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm font-sans transition-colors ${
                active
                  ? "text-[#c9a96e] bg-[#c9a96e]/5 border-r-2 border-[#c9a96e]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <button
          onClick={handleLogout}
          className="w-full text-gray-600 hover:text-red-400 text-xs font-sans py-2 transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
