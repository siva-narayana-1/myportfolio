const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: `"Siva Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || "sivanarayanamadhala@gmail.com",
      subject: "⚡ [Portfolio Verification] SMTP & Email Template Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; background: #0c0e17; color: #f0f0f5; border-radius: 12px; border: 1px solid #1e2235;">
          <h2 style="color: #00f0ff; margin-top: 0;">✅ SMTP Integration Verified!</h2>
          <p>Your Gmail SMTP configuration is active and working perfectly.</p>
          <p>Email: <strong style="color: #b026ff;">${process.env.SMTP_USER}</strong></p>
          <p style="font-size: 12px; color: #64748b;">Delivered via Portfolio Email Service.</p>
        </div>
      `,
    });
    console.log("SUCCESS: Email sent successfully! MessageId:", info.messageId);
  } catch (error) {
    console.error("FAILURE: Error sending email:", error);
  }
}

main();
