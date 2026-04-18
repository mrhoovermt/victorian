import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not set");
  return twilio(sid, token);
}

const FROM = process.env.TWILIO_PHONE_NUMBER ?? "";

export async function sendWelcomeSms(to: string, firstName: string) {
  const client = getClient();
  return client.messages.create({
    from: FROM,
    to,
    body: `Welcome to the Victorian Casino Players Club, ${firstName}! We look forward to seeing you at 6550 Hwy 93 S, Whitefish. Questions? Just reply to this message.`,
  });
}

export async function sendSmsCampaign(to: string[], message: string) {
  const client = getClient();
  const results = await Promise.allSettled(
    to.map((phone) =>
      client.messages.create({ from: FROM, to: phone, body: message })
    )
  );
  return results;
}
