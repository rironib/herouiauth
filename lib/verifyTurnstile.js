export async function verifyTurnstile(captchaToken) {
  if (!captchaToken) {
    return { success: false, error: "Captcha token is missing." };
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      },
    );

    if (!res.ok) {
      return {
        success: false,
        error: "Captcha verification service unavailable.",
      };
    }

    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        error:
          "Captcha verification failed. Please refresh the page and try again.",
      };
    }

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e.message || "Captcha verification error.",
    };
  }
}
