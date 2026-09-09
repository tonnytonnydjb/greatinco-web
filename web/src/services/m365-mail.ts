import "server-only";

type CareerNotification = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  vacancyTitle: string;
  vacancySlug: string;
  applicationId?: string | number;
};

type TokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function getGraphAccessToken(): Promise<string> {
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
    console.error("Microsoft Graph token request failed", {
      status: response.status,
      error: result.error,
    });

    throw new Error("Unable to obtain Microsoft Graph access token.");
  }

  return result.access_token;
}

export async function sendCareerApplicationNotification(data: CareerNotification): Promise<void> {
  const sender = requireEnv("M365_MAIL_FROM");

  const recipient = requireEnv("M365_HR_MAIL_TO");

  const accessToken = await getGraphAccessToken();

  const applicantName = escapeHtml(data.applicantName);

  const applicantEmail = escapeHtml(data.applicantEmail);

  const applicantPhone = escapeHtml(data.applicantPhone);

  const vacancyTitle = escapeHtml(data.vacancyTitle);

  const vacancySlug = escapeHtml(data.vacancySlug);

  const applicationId =
    data.applicationId !== undefined ? escapeHtml(String(data.applicationId)) : "-";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#071824">
      <h2 style="margin-bottom:8px">
        New Career Application
      </h2>

      <p style="color:#52606a;margin-top:0">
        A new application has been received through the Greatinco website.
      </p>

      <table
        cellpadding="8"
        cellspacing="0"
        style="width:100%;border-collapse:collapse;margin-top:24px"
      >
        <tr>
          <td style="font-weight:600;width:180px">Position</td>
          <td>${vacancyTitle}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Applicant</td>
          <td>${applicantName}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Email</td>
          <td>${applicantEmail}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Phone</td>
          <td>${applicantPhone}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Application ID</td>
          <td>${applicationId}</td>
        </tr>

        <tr>
          <td style="font-weight:600">Vacancy Slug</td>
          <td>${vacancySlug}</td>
        </tr>
      </table>

      <p style="margin-top:28px;color:#52606a">
        Review the application and CV from the authorized HR system.
        The CV is intentionally not attached to this email.
      </p>

      <hr style="border:0;border-top:1px solid #e3e6e8;margin:28px 0">

      <p style="font-size:12px;color:#7a858d">
        Automated notification from Greatinco Website.
        Please do not reply to this message.
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
          subject: `[Career Application] ${data.vacancyTitle} - ${data.applicantName}`,

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

    console.error("Microsoft Graph sendMail failed", {
      status: response.status,
      body: body.slice(0, 500),
    });

    throw new Error("Microsoft Graph email notification failed.");
  }
}
