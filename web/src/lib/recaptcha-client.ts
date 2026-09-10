export type RecaptchaAction = "contact_submit" | "career_apply";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        ready: (callback: () => void) => void;

        execute: (
          siteKey: string,
          options: {
            action: string;
          },
        ) => Promise<string>;
      };
    };
  }
}

function getSiteKey() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    throw new Error("reCAPTCHA site key is missing.");
  }

  return siteKey;
}

export async function getRecaptchaToken(action: RecaptchaAction): Promise<string> {
  const siteKey = getSiteKey();

  const enterprise = window.grecaptcha?.enterprise;

  if (!enterprise) {
    throw new Error("reCAPTCHA is not ready.");
  }

  await new Promise<void>((resolve) => {
    enterprise.ready(resolve);
  });

  return enterprise.execute(siteKey, {
    action,
  });
}
