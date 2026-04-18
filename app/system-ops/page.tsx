import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [contactCount, cateringCount, taxiCount] = await Promise.all([
    prisma.contact.count(),
    prisma.cateringLead.count(),
    prisma.taxiLead.count(),
  ]);

  const recentContacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Total Contacts", value: contactCount, href: "/system-ops/contacts" },
    { label: "Catering Inquiries", value: cateringCount, href: "/system-ops/catering" },
    { label: "Taxi Requests", value: taxiCount, href: "/system-ops/taxi" },
  ];

  return (
    <div>
      <h1 className="text-2xl text-white font-light mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-[#2a2a2a] bg-[#0d0d0d] p-6 hover:border-[#c9a96e]/40 transition-colors">
            <p className="text-gray-500 text-xs tracking-widest uppercase font-sans mb-2">{s.label}</p>
            <p className="text-4xl text-white font-light">{s.value}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg text-white font-light mb-4">Recent Contacts</h2>
        <div className="border border-[#2a2a2a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                {["Name", "Email", "Source", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs tracking-widest uppercase font-sans">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((c) => (
                <tr key={c.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                  <td className="px-4 py-3 text-white text-sm font-sans">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm font-sans">{c.email}</td>
                  <td className="px-4 py-3 text-sm font-sans">
                    <span className="text-[#c9a96e] text-xs">{c.source}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm font-sans">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
