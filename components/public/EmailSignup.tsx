"use client";
import { useState } from "react";

export function EmailSignup() {
  const [form, setForm] = useState({ email: "", phone: "", emailOptIn: true, smsOptIn: false });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Subscriber",
        lastName: "",
        email: form.email,
        phone: form.phone || undefined,
        emailOptIn: form.emailOptIn,
        smsOptIn: form.smsOptIn,
        source: "signup_form",
      }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <section id="signup" className="py-20 bg-[#111] border-y border-[#2a2a2a]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-3 font-sans">
          Stay Connected
        </p>
        <h2 className="text-3xl text-white font-light mb-8">
          Get Updates from Victorian Casino
        </h2>

        {status === "success" ? (
          <p className="text-[#c9a96e] font-sans">You&apos;re on the list. See you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                required
                type="email"
                placeholder="Email address"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans placeholder-gray-600 focus:outline-none focus:border-[#c9a96e] transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans placeholder-gray-600 focus:outline-none focus:border-[#c9a96e] transition-colors"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#c9a96e]"
                  checked={form.emailOptIn}
                  onChange={(e) => setForm({ ...form, emailOptIn: e.target.checked })}
                />
                <span className="text-gray-400 text-sm font-sans">Email updates</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#c9a96e]"
                  checked={form.smsOptIn}
                  onChange={(e) => setForm({ ...form, smsOptIn: e.target.checked })}
                />
                <span className="text-gray-400 text-sm font-sans">SMS updates</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-[#c9a96e] text-black px-8 py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
