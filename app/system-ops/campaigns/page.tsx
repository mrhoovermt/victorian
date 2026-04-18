"use client";
import { useState, useEffect } from "react";

type EmailCampaign = { id: string; subject: string; recipientCount: number; sentAt: string };
type SmsCampaign = { id: string; message: string; recipientCount: number; sentAt: string };

export default function CampaignsPage() {
  const [emails, setEmails] = useState<EmailCampaign[]>([]);
  const [sms, setSms] = useState<SmsCampaign[]>([]);
  const [tab, setTab] = useState<"email" | "sms">("email");

  useEffect(() => {
    fetch("/api/admin/email-campaign").then(r => r.json()).then(d => setEmails(d.campaigns ?? []));
    fetch("/api/admin/sms-campaign").then(r => r.json()).then(d => setSms(d.campaigns ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-white font-light mb-8">Campaign History</h1>

      <div className="flex gap-1 mb-6">
        {(["email", "sms"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-sans tracking-widest uppercase transition-colors ${tab === t ? "bg-[#c9a96e] text-black" : "border border-[#2a2a2a] text-gray-400 hover:border-[#c9a96e]"}`}
          >
            {t === "email" ? "Email" : "SMS"}
          </button>
        ))}
      </div>

      {tab === "email" && (
        <div className="border border-[#2a2a2a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                {["Subject","Recipients","Sent"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs tracking-widest uppercase font-sans">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emails.map(c => (
                <tr key={c.id} className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 text-white text-sm font-sans">{c.subject}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm font-sans">{c.recipientCount}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm font-sans">{new Date(c.sentAt).toLocaleString()}</td>
                </tr>
              ))}
              {emails.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-gray-600 text-sm font-sans text-center">No campaigns yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "sms" && (
        <div className="border border-[#2a2a2a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                {["Message","Recipients","Sent"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs tracking-widest uppercase font-sans">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sms.map(c => (
                <tr key={c.id} className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 text-white text-sm font-sans max-w-md truncate">{c.message}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm font-sans">{c.recipientCount}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm font-sans">{new Date(c.sentAt).toLocaleString()}</td>
                </tr>
              ))}
              {sms.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-gray-600 text-sm font-sans text-center">No campaigns yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
