"use client";
import { useState } from "react";
import { TAXI } from "@/content/site";

export function TaxiSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/taxi", {
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
    <section id="taxi" className="py-32 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            Coming Soon
          </p>
          <h2 className="text-4xl md:text-5xl text-white font-light mb-4">{TAXI.headline}</h2>
          <p className="text-[#c9a96e] text-xl font-light mb-8">{TAXI.subheadline}</p>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            {TAXI.description}
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-16 border border-[#c9a96e]/30 bg-[#c9a96e]/5">
            <p className="text-[#c9a96e] text-2xl font-light mb-3">Interest Noted.</p>
            <p className="text-gray-400 font-sans">We&apos;ll reach out as we finalize this service.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Preferred Date</label>
                <input type="date" className={inputClass} value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Notes</label>
              <textarea rows={3} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
            <button type="submit" disabled={status === "submitting"} className="w-full bg-[#c9a96e] text-black py-4 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50">
              {status === "submitting" ? "Submitting..." : "Express Interest"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
