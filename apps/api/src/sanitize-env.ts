/**
 * Process-level environment variable sanitizer.
 * 
 * Docker `--env-file` and `--build-arg` do NOT strip surrounding quotation marks.
 * If variables are defined with quotes (e.g. KEY="val"), Node's `process.env.KEY`
 * will literally contain the quotation marks ('"val"'), causing upstream SDKs like
 * Razorpay and New Relic to fail with HTTP 401 Authentication Failed.
 * 
 * This module runs before third-party SDKs (such as New Relic) load.
 */

export function cleanEnvString(val?: string | null): string {
  if (!val) return '';
  let clean = String(val).trim();
  while (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

const CRITICAL_ENV_KEYS = [
  'NEW_RELIC_LICENSE_KEY',
  'NEW_RELIC_APP_NAME',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'ADMIN_SECRET',
  'SENTRY_DSN',
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PASSWORD',
  'PORT',
  'NODE_ENV',
];

for (const key of CRITICAL_ENV_KEYS) {
  if (process.env[key]) {
    process.env[key] = cleanEnvString(process.env[key]);
  }
}
