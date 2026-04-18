import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCateringConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, headcount, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const lead = await prisma.cateringLead.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        eventType: eventType || undefined,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        headcount: headcount ? parseInt(headcount) : undefined,
        notes: notes || undefined,
      },
    });

    await Promise.allSettled([
      sendCateringConfirmation({ name, email, eventType }),
      sendAdminNotification(
        `New Catering Inquiry: ${name}`,
        `<p><strong>Name:</strong> ${name}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Phone:</strong> ${phone || "—"}<br/>
         <strong>Event Type:</strong> ${eventType || "—"}<br/>
         <strong>Event Date:</strong> ${eventDate || "—"}<br/>
         <strong>Headcount:</strong> ${headcount || "—"}<br/>
         <strong>Notes:</strong> ${notes || "—"}</p>`
      ),
    ]);

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("Catering POST error:", err);
    return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
  }
}
