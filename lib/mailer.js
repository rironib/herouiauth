import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITENAME = process.env.NEXT_PUBLIC_SITENAME;
const FROM_EMAIL = process.env.EMAIL_FROM;

const generateEmailHTML = (heading, message, buttonText, url) => `
  <!DOCTYPE html>
<html lang="en">
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f8fc;">
<section style="text-align: center; max-width: 520px; margin: auto; overflow-x: scroll; width:100%; padding:0; background-color:#f7f8fc;">
    <div style="background-color:#5c4fff; padding:12px; color:#ffffff;">
        <h1 style="font-weight:bold; font-size:42px;">
            ${SITENAME}
        </h1>
    </div>
<div style="border: 1px solid #ccc">
    <h2 style="padding:40px 32px 24px; font-size:28px; font-weight:600; color:#2c2e3e;">
        ${heading}
    </h2>
    <p style="padding:0 32px 40px; font-size:16px; line-height:24px; color:#4a4d63;">
        ${message}
    </p>
    <div style="padding:0 32px 40px;">
        <a href="${url}" target="_blank"
           style="background-color:#5c4fff; color:#ffffff; text-decoration:none; font-weight:600; font-size:16px; padding:14px 28px; border-radius:6px; display:inline-block;">
            ${buttonText}
        </a>
    </div>
    <p style="padding:0 32px 40px; font-size:16px; line-height:24px; color:#4a4d63;">
        Or copy this link and paste in your web browser
    </p>
    <p style="padding:0 32px 40px;">
        <a href="${url}">
            ${url}
        </a>
    </p>
    <p style="padding:0 32px 40px; font-size:14px; line-height:24px; color:#8e91a4; font-style: italic;">
        If you did not request this, you can safely ignore this email.
    </p>
    <div style="font-size:14px; color:#4a4d63; padding:16px 0 32px;">
        <p style="text-align:center;">
            &copy; <b>${SITENAME}</b> - All rights reserved.
        </p>
    </div>
    </div>
</section>
</body>
</html>
`;

export async function sendVerificationEmail(email, token) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: generateEmailHTML(
        "Verify your email address",
        "Thanks for signing up. Please click the button below to verify your email address.",
        "Verify Email",
        url,
      ),
    });
  } catch (e) {
    // Throw a proper Error so callers can handle it
    throw new Error("Email send failed");
  }
}

export async function sendPasswordResetEmail(email, token) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: generateEmailHTML(
        "Reset your password",
        "You requested a password reset. Click the button below to continue. This link will expire within 24 hours. And you can not change your password more than once in 24 hours.",
        "Reset Password",
        url,
      ),
    });
  } catch (e) {
    throw new Error("Email send failed");
  }
}
