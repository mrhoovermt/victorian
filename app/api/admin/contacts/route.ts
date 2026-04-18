import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const source = searchParams.get("source") ?? "";
  const emailOptIn = searchParams.get("emailOptIn");
  const smsOptIn = searchParams.get("smsOptIn");
  const sortBy = (searchParams.get("sortBy") as string) || "createdAt";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;

  const where = {
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(source ? { source: source as never } : {}),
    ...(emailOptIn !== null && emailOptIn !== "" ? { emailOptIn: emailOptIn === "true" } : {}),
    ...(smsOptIn !== null && smsOptIn !== "" ? { smsOptIn: smsOptIn === "true" } : {}),
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({ contacts, total, page, limit });
}
