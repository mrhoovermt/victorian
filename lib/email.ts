import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@victoriancasinowhitefish.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";

function baseLayout(content: string, previewText = "") {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Victorian Casino</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #2a2a2a;border-radius:4px;overflow:hidden;">
      <tr><td style="background:#0a0a0a;padding:30px;text-align:center;border-bottom:1px solid #c9a96e;">
        <p style="margin:0;color:#c9a96e;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Victorian Casino</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:normal;letter-spacing:1px;">Whitefish, Montana</h1>
      </td></tr>
      <tr><td style="padding:40px;color:#ccc;font-size:15px;line-height:1.7;">
        ${content}
      </td></tr>
      <tr><td style="background:#0a0a0a;padding:24px;text-align:center;border-top:1px solid #2a2a2a;">
        <p style="margin:0;color:#666;font-size:12px;">6550 Hwy 93 S Suite 104, Whitefish MT 59937</p>
        <p style="margin:6px 0 0;color:#666;font-size:12px;">Sun–Thu 8am–1am &nbsp;|&nbsp; Fri–Sat 8am–2am</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendWelcomeEmail(contact: {
  firstName: string;
  email: string;
}) {
  const content = `
<h2 style="color:#c9a96e;font-size:20px;font-weight:normal;margin:0 0 20px;">Welcome to the Players Club, ${contact.firstName}.</h2>
<p>We're glad you're here. Your account is being prepared, and we look forward to seeing you at Victorian Casino.</p>
<p>When you arrive, just let us know you signed up online — we'll have everything ready for you.</p>
<p style="margin-top:30px;color:#c9a96e;font-size:13px;letter-spacing:2px;text-transform:uppercase;">See you soon.</p>`;

  return resend.emails.send({
    from: FROM,
    to: contact.email,
    subject: "Welcome to the Victorian Casino Players Club",
    html: baseLayout(content),
  });
}

export async function sendCateringConfirmation(lead: {
  name: string;
  email: string;
  eventType?: string | null;
}) {
  const content = `
<h2 style="color:#c9a96e;font-size:20px;font-weight:normal;margin:0 0 20px;">Thank you, ${lead.name}.</h2>
<p>We've received your catering inquiry${lead.eventType ? ` for your ${lead.eventType}` : ""} and will be in touch shortly.</p>
<p>Victorian Catering serves the Flathead Valley with licensed event catering for corporate events, private parties, weddings, and outdoor gatherings.</p>
<p style="margin-top:30px;color:#c9a96e;font-size:13px;letter-spacing:2px;text-transform:uppercase;">We'll be in touch soon.</p>`;

  return resend.emails.send({
    from: FROM,
    to: lead.email,
    subject: "Victorian Catering — We Received Your Inquiry",
    html: baseLayout(content),
  });
}

export async function sendTaxiConfirmation(lead: { name: string; email: string }) {
  const content = `
<h2 style="color:#c9a96e;font-size:20px;font-weight:normal;margin:0 0 20px;">Thank you, ${lead.name}.</h2>
<p>We've received your interest in our VIP pickup service and will be in touch to confirm availability and details.</p>
<p style="margin-top:30px;color:#c9a96e;font-size:13px;letter-spacing:2px;text-transform:uppercase;">See you soon.</p>`;

  return resend.emails.send({
    from: FROM,
    to: lead.email,
    subject: "Victorian Casino — VIP Pickup Request Received",
    html: baseLayout(content),
  });
}

export async function sendAdminNotification(subject: string, bodyHtml: string) {
  if (!ADMIN_EMAIL) return;
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject,
    html: baseLayout(bodyHtml),
  });
}

export async function sendEmailCampaign(opts: {
  to: string[];
  subject: string;
  bodyHtml: string;
}) {
  const results = await Promise.allSettled(
    opts.to.map((email) =>
      resend.emails.send({
        from: FROM,
        to: email,
        subject: opts.subject,
        html: baseLayout(opts.bodyHtml),
      })
    )
  );
  return results;
}

export { resend };
