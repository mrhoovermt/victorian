import { NextRequest, NextResponse } from "next/server";
import { generateTotpSecret, generateTotpQrCode, verifyPassword, verifyTotp } from "@/lib/auth";

// GET: generate a new TOTP secret and return QR code (requires password auth)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!username || !password || username !== expectedUsername || !passwordHash) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const passwordOk = await verifyPassword(password, passwordHash);
  if (!passwordOk) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const secret = generateTotpSecret(username);
  const qrCode = await generateTotpQrCode(secret.otpauth_url ?? "");

  return NextResponse.json({
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrCode,
    instructions:
      "Scan the QR code with Google Authenticator. Then set TOTP_SECRET in your Railway environment variables to the secret value shown above.",
  });
}

// POST: verify a TOTP token against a pending secret (for confirmation before saving)
export async function POST(req: NextRequest) {
  const { secret, token } = await req.json();
  if (!secret || !token) {
    return NextResponse.json({ error: "Secret and token required." }, { status: 400 });
  }
  const valid = verifyTotp(secret, token);
  return NextResponse.json({ valid });
}
