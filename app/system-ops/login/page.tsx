"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "totp" | "setup">("credentials");
  const [form, setForm] = useState({ username: "", password: "", totpToken: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [setupToken, setSetupToken] = useState("");
  const [setupVerified, setSetupVerified] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, password: form.password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Login failed.");
      return;
    }

    if (data.requiresTotpSetup) {
      // Fetch QR code
      const setupRes = await fetch(
        `/api/auth/setup-totp?username=${encodeURIComponent(form.username)}&password=${encodeURIComponent(form.password)}`
      );
      const setupJson = await setupRes.json();
      setSetupData({ secret: setupJson.secret, qrCode: setupJson.qrCode });
      setStep("setup");
      return;
    }

    if (data.requiresTotp) {
      setStep("totp");
      return;
    }

    if (data.success) {
      router.push("/system-ops");
    }
  }

  async function handleTotp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, password: form.password, totpToken: form.totpToken }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setError(data.error ?? "Invalid code.");
      return;
    }

    router.push("/system-ops");
  }

  async function handleVerifySetup(e: React.FormEvent) {
    e.preventDefault();
    if (!setupData) return;
    const res = await fetch("/api/auth/setup-totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: setupData.secret, token: setupToken }),
    });
    const data = await res.json();
    if (data.valid) {
      setSetupVerified(true);
    } else {
      setError("Invalid code — try again.");
    }
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 text-sm font-sans placeholder-gray-600 focus:outline-none focus:border-[#c9a96e] transition-colors";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-2 font-sans">
            Victorian Casino
          </p>
          <h1 className="text-2xl text-white font-light">Admin Access</h1>
        </div>

        <div className="border border-[#2a2a2a] bg-[#0d0d0d] p-8">
          {step === "credentials" && (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Username</label>
                <input required className={inputClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
              </div>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Password</label>
                <input required type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
              </div>
              {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#c9a96e] text-black py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50">
                {loading ? "..." : "Continue"}
              </button>
            </form>
          )}

          {step === "totp" && (
            <form onSubmit={handleTotp} className="space-y-4">
              <p className="text-gray-400 text-sm font-sans mb-4">Enter the 6-digit code from Google Authenticator.</p>
              <div>
                <label className="block text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Authenticator Code</label>
                <input
                  required
                  className={inputClass}
                  value={form.totpToken}
                  onChange={(e) => setForm({ ...form, totpToken: e.target.value })}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#c9a96e] text-black py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors disabled:opacity-50">
                {loading ? "..." : "Verify"}
              </button>
            </form>
          )}

          {step === "setup" && setupData && (
            <div className="space-y-6">
              <p className="text-gray-400 text-sm font-sans">
                No TOTP secret is configured. Scan this QR code with Google Authenticator.
              </p>
              <div className="flex justify-center">
                <img src={setupData.qrCode} alt="TOTP QR Code" className="w-48 h-48" />
              </div>
              <div className="bg-[#111] border border-[#2a2a2a] p-3 rounded">
                <p className="text-gray-500 text-xs font-sans mb-1">Manual entry secret:</p>
                <p className="text-[#c9a96e] text-xs font-mono break-all">{setupData.secret}</p>
              </div>

              {!setupVerified ? (
                <form onSubmit={handleVerifySetup} className="space-y-3">
                  <p className="text-gray-400 text-xs font-sans">Confirm by entering the code shown in your app:</p>
                  <input
                    required
                    className={inputClass}
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="6-digit code"
                  />
                  {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
                  <button type="submit" className="w-full bg-[#c9a96e] text-black py-3 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors">
                    Verify Code
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="text-green-400 text-sm font-sans text-center">✓ Code verified</div>
                  <div className="bg-yellow-900/30 border border-yellow-700/40 p-4">
                    <p className="text-yellow-400 text-xs font-sans leading-relaxed">
                      <strong>Action required:</strong> Set the following environment variable in Railway before logging in:<br /><br />
                      <code className="font-mono">TOTP_SECRET={setupData.secret}</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
