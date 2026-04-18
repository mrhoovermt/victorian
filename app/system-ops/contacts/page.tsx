"use client";
import { useState, useEffect, useCallback } from "react";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthdayMonth: number | null;
  birthdayDay: number | null;
  favoriteDrink: string | null;
  source: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  createdAt: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [emailOptIn, setEmailOptIn] = useState("");
  const [smsOptIn, setSmsOptIn] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams({
      search,
      source,
      emailOptIn,
      smsOptIn,
      page: page.toString(),
    });
    const res = await fetch(`/api/admin/contacts?${params}`);
    const data = await res.json();
    setContacts(data.contacts ?? []);
    setTotal(data.total ?? 0);
  }, [search, source, emailOptIn, smsOptIn, page]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    setSelected(null);
    fetchContacts();
  }

  async function handleSave(id: string, updates: Partial<Contact>) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    fetchContacts();
    setSelected(null);
  }

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div>
      <h1 className="text-2xl text-white font-light mb-6">Contacts <span className="text-gray-600 text-lg">({total})</span></h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="bg-[#111] border border-[#2a2a2a] text-white px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#c9a96e] flex-1 min-w-48"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="bg-[#111] border border-[#2a2a2a] text-gray-400 px-3 py-2 text-sm font-sans focus:outline-none" value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}>
          <option value="">All Sources</option>
          <option value="players_club">Players Club</option>
          <option value="signup_form">Signup Form</option>
          <option value="manual">Manual</option>
        </select>
        <select className="bg-[#111] border border-[#2a2a2a] text-gray-400 px-3 py-2 text-sm font-sans focus:outline-none" value={emailOptIn} onChange={(e) => { setEmailOptIn(e.target.value); setPage(1); }}>
          <option value="">Email: All</option>
          <option value="true">Email Opt-In</option>
          <option value="false">Email Opt-Out</option>
        </select>
        <select className="bg-[#111] border border-[#2a2a2a] text-gray-400 px-3 py-2 text-sm font-sans focus:outline-none" value={smsOptIn} onChange={(e) => { setSmsOptIn(e.target.value); setPage(1); }}>
          <option value="">SMS: All</option>
          <option value="true">SMS Opt-In</option>
          <option value="false">SMS Opt-Out</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-[#2a2a2a] overflow-x-auto mb-4">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {["Name","Email","Phone","Birthday","Drink","Source","Email","SMS","Joined"].map((h) => (
                <th key={h} className="text-left px-3 py-3 text-gray-500 text-xs tracking-widest uppercase font-sans whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b border-[#1a1a1a] hover:bg-[#111] cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                <td className="px-3 py-3 text-white text-sm font-sans whitespace-nowrap">{c.firstName} {c.lastName}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans">{c.email}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans">{c.phone ?? "—"}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans whitespace-nowrap">{c.birthdayMonth ? `${months[c.birthdayMonth - 1]} ${c.birthdayDay}` : "—"}</td>
                <td className="px-3 py-3 text-gray-400 text-sm font-sans">{c.favoriteDrink ?? "—"}</td>
                <td className="px-3 py-3 text-xs font-sans"><span className="text-[#c9a96e]">{c.source}</span></td>
                <td className="px-3 py-3 text-sm font-sans">{c.emailOptIn ? <span className="text-green-500">✓</span> : <span className="text-gray-600">—</span>}</td>
                <td className="px-3 py-3 text-sm font-sans">{c.smsOptIn ? <span className="text-green-500">✓</span> : <span className="text-gray-600">—</span>}</td>
                <td className="px-3 py-3 text-gray-500 text-sm font-sans whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-[#2a2a2a] text-gray-400 text-sm font-sans disabled:opacity-30 hover:border-[#c9a96e] transition-colors">← Prev</button>
        <span className="px-3 py-1 text-gray-500 text-sm font-sans">Page {page}</span>
        <button disabled={contacts.length < 50} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-[#2a2a2a] text-gray-400 text-sm font-sans disabled:opacity-30 hover:border-[#c9a96e] transition-colors">Next →</button>
      </div>

      {/* Detail modal */}
      {selected && (
        <ContactDetail
          contact={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDeleteRequest={() => setDeleteConfirm(selected.id)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#2a2a2a] p-8 max-w-sm w-full mx-4">
            <p className="text-white font-sans mb-6">Delete this contact? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-800 text-white py-2 text-sm font-sans hover:bg-red-700 transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-[#2a2a2a] text-gray-400 py-2 text-sm font-sans hover:border-[#c9a96e] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactDetail({ contact, onClose, onSave, onDeleteRequest }: {
  contact: Contact;
  onClose: () => void;
  onSave: (id: string, data: Partial<Contact>) => void;
  onDeleteRequest: () => void;
}) {
  const [form, setForm] = useState(contact);

  const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#c9a96e] transition-colors";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-end z-50">
      <div className="bg-[#0d0d0d] border-l border-[#2a2a2a] h-full w-full max-w-md overflow-y-auto p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-white font-light text-xl">{contact.firstName} {contact.lastName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white font-sans">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">First Name</label>
              <input className={inputClass} value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">Last Name</label>
              <input className={inputClass} value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">Email</label>
            <input className={inputClass} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">Phone</label>
            <input className={inputClass} value={form.phone ?? ""} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-1 font-sans">Favorite Drink</label>
            <input className={inputClass} value={form.favoriteDrink ?? ""} onChange={(e) => setForm({...form, favoriteDrink: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#c9a96e]" checked={form.emailOptIn} onChange={(e) => setForm({...form, emailOptIn: e.target.checked})} />
              <span className="text-gray-400 text-sm font-sans">Email Opt-In</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#c9a96e]" checked={form.smsOptIn} onChange={(e) => setForm({...form, smsOptIn: e.target.checked})} />
              <span className="text-gray-400 text-sm font-sans">SMS Opt-In</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={() => onSave(contact.id, form)} className="flex-1 bg-[#c9a96e] text-black py-2 text-sm font-sans tracking-widest uppercase hover:bg-[#e4c68a] transition-colors">Save</button>
          <button onClick={onDeleteRequest} className="border border-red-800 text-red-500 px-4 py-2 text-sm font-sans hover:bg-red-900/20 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}
