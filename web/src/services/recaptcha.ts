import "server-only";

import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const MIN_SCORE = 0.5;

const client = new RecaptchaEnterpriseServiceClient();

export type RecaptchaAction = "contact_submit" | "career_apply";

type VerifyRecaptchaInput = {
  token: string;
  expectedAction: RecaptchaAction;
  userAgent?: string;
};

type VerifyRecaptchaResult = {
  ok: boolean;
  score: number;
  reason?: string;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export async function verifyRecaptcha({
  token,
  expectedAction,
  userAgent,
}: VerifyRecaptchaInput): Promise<VerifyRecaptchaResult> {
  if (!token) {
    return {
      ok: false,
      score: 0,
      reason: "missing-token",
    };
  }

  const projectId = requireEnv("RECAPTCHA_PROJECT_ID");

  const siteKey = requireEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");

  const parent = client.projectPath(projectId);

  const [assessment] = await client.createAssessment({
    parent,
    assessment: {
      event: {
        token,
        siteKey,
        userAgent: userAgent || undefined,
      },
    },
  });

  const tokenProperties = assessment.tokenProperties;

  if (!tokenProperties?.valid) {
    return {
      ok: false,
      score: 0,
      reason: "invalid-token",
    };
  }

  if (tokenProperties.action !== expectedAction) {
    return {
      ok: false,
      score: 0,
      reason: "action-mismatch",
    };
  }

  const score = assessment.riskAnalysis?.score ?? 0;

  if (score < MIN_SCORE) {
    return {
      ok: false,
      score,
      reason: "low-score",
    };
  }

  return {
    ok: true,
    score,
  };
}
