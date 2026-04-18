import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { sendEmailCampaign } from "@/lib/email";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { sentAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;

  const { subject, bodyHtml, segment } = await req.json();
  if (!subject || !bodyHtml) {
    return NextResponse.json({ error: "Subject and body required." }, { status: 400 });
  }

  const where: Record<string, unknown> = {};
  if (segment === "email_optin") where.emailOptIn = true;
  if (segment === "players_club") where.source = "players_club";

  const contacts = await prisma.contact.findMany({
    where: { ...where, emailOptIn: true },
    select: { email: true },
  });

  const emails = contacts.map((c: { email: string }) => c.email);

  await sendEmailCampaign({ to: emails, subject, bodyHtml });

  const campaign = await prisma.emailCampaign.create({
    data: { subject, bodyHtml, recipientCount: emails.length },
  });

  return NextResponse.json({ success: true, campaign, recipientCount: emails.length });
}
