"use client";
import { useState } from "react";

const MAX_SMS = 160;

export default function SendSmsPage() {
  const [form, setForm] = useState({ message: "", segment: "sms_optin" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState<{ recipientCount: number } | null>(null);

  async function handleSend() {
    setStatus("sending");
    const res = await fetch("/api/admin/sms-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("sent");
      setResult(data);
    } else {
      setStatus("error");
    }
  }

  const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#c9a96e] transition-colors";
  const charCount = form.message.length;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl text-white font-light mb-8">Send SMS Campaign</h1>

      {status === "sent" && result ? (
        <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 p-8 text-center">
          <p className="text-[#c9a96e] text-xl font-light mb-2">SMS Sent</p>
          <p className="text-gray-400 font-sans">{result.recipientCount} recipients</p>
          <button onClick={() => { setStatus("idle"); setResult(null); setForm({ message: "", segment: "sms_optin" }); }} className="mt-6 border border-[#2a2a2a] text-gray-400 px-6 py-2 text-sm font-sans hover:border-[#c9a96e] transition-colors">
            New Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Audience</label>
            <select className={inputClass} value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
              <option value="sms_optin">All SMS Opt-Ins</option>
              <option value="players_club">Players Club SMS Opt-Ins</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-500 text-xs uppercase tracking-widest font-sans">Message</label>
              <span className={`text-xs font-sans ${charCount > MAX_SMS ? "text-red-400" : "text-gray-500"}`}>
                {charCount}/{MAX_SMS}
              </span>
            </div>
            <textarea
              rows={5}
              className={inputClass}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your SMS message..."
            />
            {charCount > MAX_SMS && (
              <p className="text-yellow-500 text-xs font-sans mt-1">Messages over {MAX_SMS} characters will be split into multiple SMS.</p>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={status === "sending" || !form.message}
            className="w-full bg-[#c9a96e] text-black py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send SMS Campaign"}
          </button>
        </div>
      )}
    </div>
  );
}
