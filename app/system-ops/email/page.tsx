"use client";
import { useState } from "react";

export default function SendEmailPage() {
  const [form, setForm] = useState({ subject: "", bodyHtml: "", segment: "email_optin" });
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState<{ recipientCount: number } | null>(null);

  async function handleSend() {
    setStatus("sending");
    const res = await fetch("/api/admin/email-campaign", {
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

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl text-white font-light mb-8">Send Email Campaign</h1>

      {status === "sent" && result ? (
        <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 p-8 text-center">
          <p className="text-[#c9a96e] text-xl font-light mb-2">Campaign Sent</p>
          <p className="text-gray-400 font-sans">{result.recipientCount} recipients</p>
          <button onClick={() => { setStatus("idle"); setResult(null); setForm({ subject: "", bodyHtml: "", segment: "email_optin" }); }} className="mt-6 border border-[#2a2a2a] text-gray-400 px-6 py-2 text-sm font-sans hover:border-[#c9a96e] transition-colors">
            New Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Audience</label>
            <select className={inputClass} value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
              <option value="email_optin">All Email Opt-Ins</option>
              <option value="players_club">Players Club Only</option>
              <option value="all">All Contacts with Email</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Subject Line</label>
            <input className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Your subject..." />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Body (HTML)</label>
            <textarea
              rows={16}
              className={inputClass + " font-mono text-xs"}
              value={form.bodyHtml}
              onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
              placeholder="<p>Your message here...</p>"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPreview(!preview)} className="border border-[#2a2a2a] text-gray-400 px-6 py-3 text-sm font-sans hover:border-[#c9a96e] transition-colors">
              {preview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={handleSend}
              disabled={status === "sending" || !form.subject || !form.bodyHtml}
              className="flex-1 bg-[#c9a96e] text-black py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Campaign"}
            </button>
          </div>

          {preview && form.bodyHtml && (
            <div className="border border-[#2a2a2a] p-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-sans">Preview</p>
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.bodyHtml }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
