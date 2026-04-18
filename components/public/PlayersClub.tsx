"use client";
import { useState } from "react";

export function PlayersClub() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthdayMonth: "",
    birthdayDay: "",
    favoriteDrink: "",
    emailOptIn: false,
    smsOptIn: false,
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          birthdayMonth: form.birthdayMonth ? parseInt(form.birthdayMonth) : undefined,
          birthdayDay: form.birthdayDay ? parseInt(form.birthdayDay) : undefined,
          source: "players_club",
        }),
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
    <section id="players-club" className="py-32 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            Join Us
          </p>
          <h2 className="text-4xl md:text-5xl text-white font-light mb-6">Players Club</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Let us know you&apos;re coming — we&apos;ll have your account ready and your favorite
            drink waiting.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-16 border border-[#c9a96e]/30 bg-[#c9a96e]/5">
            <p className="text-[#c9a96e] text-2xl font-light mb-3">Welcome.</p>
            <p className="text-gray-400 font-sans">
              Check your email — we&apos;ll see you soon at Victorian Casino.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  First Name *
                </label>
                <input
                  required
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Last Name *
                </label>
                <input
                  required
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Phone
                </label>
                <input
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Birthday Month
                </label>
                <select
                  className={inputClass}
                  value={form.birthdayMonth}
                  onChange={(e) => setForm({ ...form, birthdayMonth: e.target.value })}
                >
                  <option value="">— Month —</option>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Birthday Day
                </label>
                <select
                  className={inputClass}
                  value={form.birthdayDay}
                  onChange={(e) => setForm({ ...form, birthdayDay: e.target.value })}
                >
                  <option value="">— Day —</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                  Favorite Beer or Wine
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Coors Light, Merlot"
                  value={form.favoriteDrink}
                  onChange={(e) => setForm({ ...form, favoriteDrink: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Anything you'd like us to know"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#c9a96e]"
                  checked={form.emailOptIn}
                  onChange={(e) => setForm({ ...form, emailOptIn: e.target.checked })}
                />
                <span className="text-gray-400 text-sm font-sans">
                  Yes, send me email updates about promotions and events
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#c9a96e]"
                  checked={form.smsOptIn}
                  onChange={(e) => setForm({ ...form, smsOptIn: e.target.checked })}
                />
                <span className="text-gray-400 text-sm font-sans">
                  Yes, send me SMS text updates (message & data rates may apply)
                </span>
              </label>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-sans">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-[#c9a96e] text-black py-4 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Join the Players Club"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
