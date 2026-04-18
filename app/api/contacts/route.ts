import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email";
import { sendWelcomeSms } from "@/lib/sms";
import type { ContactSource } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      birthdayMonth,
      birthdayDay,
      favoriteDrink,
      emailOptIn,
      smsOptIn,
      source = "players_club",
      notes,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        phone: phone || undefined,
        birthdayMonth: birthdayMonth || undefined,
        birthdayDay: birthdayDay || undefined,
        favoriteDrink: favoriteDrink || undefined,
        emailOptIn: !!emailOptIn,
        smsOptIn: !!smsOptIn,
        notes: notes || undefined,
      },
      create: {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        birthdayMonth: birthdayMonth || undefined,
        birthdayDay: birthdayDay || undefined,
        favoriteDrink: favoriteDrink || undefined,
        emailOptIn: !!emailOptIn,
        smsOptIn: !!smsOptIn,
        source: source as ContactSource,
        notes: notes || undefined,
      },
    });

    await Promise.allSettled([
      sendWelcomeEmail({ firstName, email }),
      sendAdminNotification(
        `New Players Club Signup: ${firstName} ${lastName}`,
        `<p><strong>Name:</strong> ${firstName} ${lastName}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Phone:</strong> ${phone || "—"}<br/>
         <strong>Favorite Drink:</strong> ${favoriteDrink || "—"}<br/>
         <strong>Email Opt-In:</strong> ${emailOptIn ? "Yes" : "No"}<br/>
         <strong>SMS Opt-In:</strong> ${smsOptIn ? "Yes" : "No"}</p>`
      ),
      ...(phone && smsOptIn ? [sendWelcomeSms(phone, firstName)] : []),
    ]);

    return NextResponse.json({ success: true, id: contact.id });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json({ error: "Failed to save contact." }, { status: 500 });
  }
}
