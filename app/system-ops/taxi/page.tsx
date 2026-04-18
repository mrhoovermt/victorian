"use client";
import { useState, useEffect, useCallback } from "react";

type TaxiLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferredDate: string | null;
  notes: string | null;
  internalNotes: string | null;
  contacted: boolean;
  createdAt: string;
};

export default function TaxiPage() {
  const [leads, setLeads] = useState<TaxiLead[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TaxiLead | null>(null);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams({ search });
    const res = await fetch(`/api/admin/taxi?${params}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setTotal(data.total ?? 0);
  }, [search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleSave(id: string, updates: Partial<TaxiLead>) {
    await fetch(`/api/admin/taxi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    fetchLeads();
    setSelected(null);
  }

  return (
    <div>
      <h1 className="text-2xl text-white font-light mb-6">Taxi / VIP Pickup Leads <span className="text-gray-600 text-lg">({total})</span></h1>

      <input
        className="bg-[#111] border border-[#2a2a2a] text-white px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#c9a96e] mb-6 w-full max-w-sm"
        placeholder="Search name, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {["Name","Email","Phone","Preferred Date","Contacted","Received"].map((h) => (
                <th key={h} className="text-left px-3 py-3 text-gray-500 text-xs tracking-widest uppercase font-sans whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer transition-colors" onClick={() => setSelected(l)}>
                <td className="px-3 py-3 text-white text-sm font-sans">{l.name}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans">{l.email}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans">{l.phone ?? "—"}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans whitespace-nowrap">{l.preferredDate ? new Date(l.preferredDate).toLocaleDateString() : "—"}</td>
                <td className="px-3 py-3 text-sm font-sans">{l.contacted ? <span className="text-green-500">✓</span> : <span className="text-gray-600">—</span>}</td>
                <td className="px-3 py-3 text-gray-500 text-sm font-sans whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-end z-50">
          <div className="bg-[#0d0d0d] border-l border-[#2a2a2a] h-full w-full max-w-md overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-white font-light text-xl">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white font-sans">✕</button>
            </div>
            <div className="space-y-3 mb-6 text-sm font-sans">
              <p><span className="text-gray-500">Email:</span> <span className="text-gray-300">{selected.email}</span></p>
              <p><span className="text-gray-500">Phone:</span> <span className="text-gray-300">{selected.phone ?? "—"}</span></p>
              <p><span className="text-gray-500">Preferred Date:</span> <span className="text-gray-300">{selected.preferredDate ? new Date(selected.preferredDate).toLocaleDateString() : "—"}</span></p>
              <p><span className="text-gray-500">Notes:</span> <span className="text-gray-300">{selected.notes ?? "—"}</span></p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">Internal Notes</label>
                <textarea rows={4} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#c9a96e]" defaultValue={selected.internalNotes ?? ""} id="taxiNotes" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#c9a96e]" defaultChecked={selected.contacted} id="taxiContacted" />
                <span className="text-gray-400 text-sm font-sans">Mark as Contacted</span>
              </label>
              <button
                onClick={() => {
                  const notes = (document.getElementById("taxiNotes") as HTMLTextAreaElement)?.value;
                  const contacted = (document.getElementById("taxiContacted") as HTMLInputElement)?.checked;
                  handleSave(selected.id, { internalNotes: notes, contacted });
                }}
                className="w-full bg-[#c9a96e] text-black py-2 text-sm font-sans tracking-widest uppercase hover:bg-[#e4c68a] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
