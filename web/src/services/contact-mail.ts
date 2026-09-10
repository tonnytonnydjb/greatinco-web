import "server-only";

type ContactNotification = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};

type TokenResponse = {
  access_token?: string;
  error?: string;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function getAccessToken() {
  const tenantId = requireEnv("M365_TENANT_ID");

  const clientId = requireEnv("M365_CLIENT_ID");

  const clientSecret = requireEnv("M365_CLIENT_SECRET");

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    },
  );

  const result = (await response.json()) as TokenResponse;

  if (!response.ok || !result.access_token) {
    throw new Error("Unable to obtain Microsoft Graph access token.");
  }

  return result.access_token;
}

export async function sendContactNotification(data: ContactNotification) {
  const sender = requireEnv("M365_MAIL_FROM");

  const recipient = requireEnv("M365_CONTACT_MAIL_TO");

  const accessToken = await getAccessToken();

  const fullName = escapeHtml(data.fullName);

  const email = escapeHtml(data.email);

  const phone = escapeHtml(data.phone);

  const company = escapeHtml(data.company || "-");

  const subject = escapeHtml(data.subject);

  const message = escapeHtml(data.message).replaceAll("\n", "<br>");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#071824">
      <h2>New Website Inquiry</h2>

      <p style="color:#52606a">
        A new inquiry has been submitted through the Greatinco website.
      </p>

      <table
        cellpadding="8"
        cellspacing="0"
        style="width:100%;border-collapse:collapse;margin-top:24px"
      >
        <tr>
          <td style="width:160px;font-weight:600">Name</td>
          <td>${fullName}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Email</td>
          <td>${email}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Phone</td>
          <td>${phone}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Company</td>
          <td>${company}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Subject</td>
          <td>${subject}</td>
        </tr>
      </table>

      <div style="margin-top:28px">
        <strong>Message</strong>

        <div style="margin-top:10px;padding:18px;background:#f4f4f1;line-height:1.7">
          ${message}
        </div>
      </div>

      <hr style="border:0;border-top:1px solid #e3e6e8;margin:28px 0">

      <p style="font-size:12px;color:#7a858d">
        Automated notification from Greatinco Website.
      </p>
    </div>
  `;

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `[Website Inquiry] ${data.subject} - ${data.fullName}`,

          body: {
            contentType: "HTML",
            content: html,
          },

          toRecipients: [
            {
              emailAddress: {
                address: recipient,
              },
            },
          ],
        },

        saveToSentItems: true,
      }),
      cache: "no-store",
    },
  );

  if (response.status !== 202) {
    const body = await response.text();

    console.error("Contact Graph mail failed", {
      status: response.status,
      body: body.slice(0, 500),
    });

    throw new Error("Unable to send contact notification.");
  }
}
