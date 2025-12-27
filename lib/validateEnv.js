// lib/validateEnv.js

/**
 * Validates required environment variables on app startup
 * Throws an error if any required variables are missing
 */
export function validateEnv() {
  const required = [
    "DB_URI",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "NEXT_PUBLIC_SITENAME",
    "NEXT_PUBLIC_BASE_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(process.env.EMAIL_FROM)) {
    throw new Error("EMAIL_FROM must be a valid email address");
  }

  // Validate URL formats
  try {
    new URL(process.env.NEXTAUTH_URL);
    new URL(process.env.NEXT_PUBLIC_BASE_URL);
  } catch (e) {
    throw new Error("NEXTAUTH_URL and NEXT_PUBLIC_BASE_URL must be valid URLs");
  }

  // Environment validated successfully
}
