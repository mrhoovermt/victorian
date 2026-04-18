import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { sendSmsCampaign } from "@/lib/sms";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const campaigns = await prisma.smsCampaign.findMany({
    orderBy: { sentAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { message, segment } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message required." }, { status: 400 });
  }

  const where: Record<string, unknown> = { smsOptIn: true, phone: { not: null } };
  if (segment === "players_club") where.source = "players_club";

  const contacts = await prisma.contact.findMany({
    where: where as never,
    select: { phone: true },
  });

  const phones = contacts.map((c: { phone: string | null }) => c.phone).filter(Boolean) as string[];

  await sendSmsCampaign(phones, message);

  const campaign = await prisma.smsCampaign.create({
    data: { message, recipientCount: phones.length },
  });

  return NextResponse.json({ success: true, campaign, recipientCount: phones.length });
}
