import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { cookies } from "next/headers";

const SESSION_COOKIE = "vc_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function createSession(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .sign(getSecret());
  return token;
}

export async function verifySession(
  token: string
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.username ?? null;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTotpSecret(username: string) {
  const secret = speakeasy.generateSecret({
    name: `Victorian Casino (${username})`,
    issuer: "Victorian Casino",
    length: 20,
  });
  return secret;
}

export async function generateTotpQrCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTotp(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}

export { SESSION_COOKIE };
