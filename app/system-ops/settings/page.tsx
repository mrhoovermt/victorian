"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState("");
  const [totpForm, setTotpForm] = useState({ password: "", token: "" });
  const [newTotp, setNewTotp] = useState<{ secret: string; qrCode: string } | null>(null);
  const [totpStatus, setTotpStatus] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwStatus("Passwords do not match.");
      return;
    }
    setPwStatus("Password changes require a Railway deployment update. Hash your new password with bcrypt and set ADMIN_PASSWORD_HASH in Railway.");
  }

  async function handleRegenerateTotp(e: React.FormEvent) {
    e.preventDefault();
    const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "admin";
    const res = await fetch(`/api/auth/setup-totp?username=${encodeURIComponent(username)}&password=${encodeURIComponent(totpForm.password)}`);
    if (!res.ok) {
      setTotpStatus("Invalid password.");
      return;
    }
    const data = await res.json();
    setNewTotp({ secret: data.secret, qrCode: data.qrCode });
    setTotpStatus("");
  }

  const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#c9a96e] transition-colors";

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="text-2xl text-white font-light mb-8">Settings</h1>
      </div>

      {/* Password change */}
      <section>
        <h2 className="text-lg text-white font-light mb-6 pb-3 border-b border-[#2a2a2a]">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Current Password</label>
            <input type="password" className={inputClass} value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">New Password</label>
            <input type="password" className={inputClass} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Confirm New Password</label>
            <input type="password" className={inputClass} value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
          </div>
          {pwStatus && <p className="text-yellow-400 text-sm font-sans">{pwStatus}</p>}
          <button type="submit" className="bg-[#c9a96e] text-black px-8 py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors">
            Get Instructions
          </button>
        </form>
      </section>

      {/* TOTP regenerate */}
      <section>
        <h2 className="text-lg text-white font-light mb-6 pb-3 border-b border-[#2a2a2a]">Regenerate TOTP Secret</h2>
        <p className="text-gray-500 text-sm font-sans mb-6">
          Generates a new authenticator QR code. After scanning, you must update TOTP_SECRET in Railway.
        </p>
        {!newTotp ? (
          <form onSubmit={handleRegenerateTotp} className="space-y-4">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 font-sans">Confirm Password</label>
              <input type="password" required className={inputClass} value={totpForm.password} onChange={(e) => setTotpForm({ ...totpForm, password: e.target.value })} />
            </div>
            {totpStatus && <p className="text-red-400 text-sm font-sans">{totpStatus}</p>}
            <button type="submit" className="border border-[#c9a96e] text-[#c9a96e] px-8 py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#c9a96e] hover:text-black transition-colors">
              Generate New QR Code
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={newTotp.qrCode} alt="New TOTP QR" className="w-48 h-48" />
            </div>
            <div className="bg-[#111] border border-[#2a2a2a] p-3">
              <p className="text-gray-500 text-xs font-sans mb-1">New secret (set in Railway):</p>
              <p className="text-[#c9a96e] text-xs font-mono break-all">{newTotp.secret}</p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-700/40 p-4">
              <p className="text-yellow-400 text-xs font-sans">
                Scan the QR code, then update TOTP_SECRET in your Railway environment variables and redeploy.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
