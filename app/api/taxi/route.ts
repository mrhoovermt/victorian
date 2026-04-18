import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTaxiConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, preferredDate, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const lead = await prisma.taxiLead.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        notes: notes || undefined,
      },
    });

    await Promise.allSettled([
      sendTaxiConfirmation({ name, email }),
      sendAdminNotification(
        `New VIP Pickup Request: ${name}`,
        `<p><strong>Name:</strong> ${name}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Phone:</strong> ${phone || "—"}<br/>
         <strong>Preferred Date:</strong> ${preferredDate || "—"}<br/>
         <strong>Notes:</strong> ${notes || "—"}</p>`
      ),
    ]);

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("Taxi POST error:", err);
    return NextResponse.json({ error: "Failed to save request." }, { status: 500 });
  }
}
