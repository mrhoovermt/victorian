import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const lead = await prisma.taxiLead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await req.json();
  const lead = await prisma.taxiLead.update({ where: { id }, data: body });
  return NextResponse.json(lead);
}
