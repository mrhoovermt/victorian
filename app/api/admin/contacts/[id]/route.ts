import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  const body = await req.json();
  const contact = await prisma.contact.update({ where: { id }, data: body });
  return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
