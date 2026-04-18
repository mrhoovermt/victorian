"use client";
import { useState } from "react";
import { CATERING } from "@/content/site";

export function Catering() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    headcount: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans placeholder-gray-600 focus:outline-none focus:border-[#c9a96e] transition-colors";

  return (
    <section id="catering" className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
              Events
            </p>
            <h2 className="text-4xl md:text-5xl text-white font-light mb-4">
              {CATERING.headline}
            </h2>
            <p className="text-[#c9a96e] text-lg mb-8 font-light">{CATERING.subheadline}</p>
            <p className="text-gray-400 leading-relaxed mb-8 font-sans">{CATERING.description}</p>
            <div className="space-y-2">
              {CATERING.eventTypes.slice(0, -1).map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-[#c9a96e] rounded-full" />
                  <span className="text-gray-400 font-sans text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {status === "success" ? (
              <div className="text-center py-16 border border-[#c9a96e]/30 bg-[#c9a96e]/5 h-full flex flex-col items-center justify-center">
                <p className="text-[#c9a96e] text-2xl font-light mb-3">Inquiry Received.</p>
                <p className="text-gray-400 font-sans">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Name *</label>
                    <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Email *</label>
                    <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Phone</label>
                    <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Event Type</label>
                    <select className={inputClass} value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
                      <option value="">— Select —</option>
                      {CATERING.eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Event Date</label>
                    <input type="date" className={inputClass} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Estimated Headcount</label>
                    <input type="number" min="1" className={inputClass} value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Notes / Details</label>
                  <textarea rows={4} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
                <button type="submit" disabled={status === "submitting"} className="w-full bg-[#c9a96e] text-black py-4 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50">
                  {status === "submitting" ? "Submitting..." : "Send Catering Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
