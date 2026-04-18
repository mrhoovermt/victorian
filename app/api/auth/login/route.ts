import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, verifyTotp, createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password, totpToken } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const totpSecret = process.env.TOTP_SECRET;

    if (!expectedUsername || !passwordHash) {
      return NextResponse.json(
        { error: "Admin credentials not configured." },
        { status: 500 }
      );
    }

    if (username !== expectedUsername) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const passwordOk = await verifyPassword(password, passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // If no TOTP secret, redirect to setup
    if (!totpSecret) {
      return NextResponse.json({ requiresTotpSetup: true }, { status: 200 });
    }

    if (!totpToken) {
      return NextResponse.json({ requiresTotp: true }, { status: 200 });
    }

    const totpOk = verifyTotp(totpSecret, totpToken);
    if (!totpOk) {
      return NextResponse.json({ error: "Invalid TOTP code." }, { status: 401 });
    }

    const token = await createSession(username);
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
