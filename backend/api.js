const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
let PrismaClient;
try {
  PrismaClient = require("../node_modules/@prisma/client").PrismaClient;
} catch {
  PrismaClient = require("@prisma/client").PrismaClient;
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.BACKEND_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// SMTP Transporter for contact form email delivery to Siva
const SMTP_USER = (process.env.SMTP_USER || "sivanarayanamadhala@gmail.com").trim();
const SMTP_PASS = (process.env.SMTP_PASS || "yvih bdie xllv hfyz").replace(/\s+/g, "");
const RECIPIENT_EMAIL = (process.env.CONTACT_RECEIVER_EMAIL || "sivanarayanamadhala@gmail.com").trim();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3004",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3004",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL || "http://localhost:3004",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware: Auth Check
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ═══════════════════════════════════════
// PUBLIC PORTFOLIO ROUTES
// ═══════════════════════════════════════

// Get Profile
app.get("/api/portfolio/profile", async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get Projects
app.get("/api/portfolio/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get Skills
app.get("/api/portfolio/skills", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" },
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// Get Experience
app.get("/api/portfolio/experience", async (req, res) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// Get Education
app.get("/api/portfolio/education", async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: "desc" },
    });
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

// Submit Contact Message
app.post("/api/portfolio/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const finalSubject = subject && subject.trim() ? subject.trim() : `Portfolio Inquiry from ${name}`;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: finalSubject,
        message: message.trim(),
      },
    });

    // Send email notification directly to Siva
    let emailSent = false;
    let emailErrorMsg = null;
    try {
      const recipient = RECIPIENT_EMAIL || "sivanarayanamadhala@gmail.com";
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      console.log(`📧 Dispatching portfolio inquiry from ${name} (${email}) to ${recipient}...`);

      const mailInfo = await transporter.sendMail({
        from: `"Siva Portfolio Lead" <${SMTP_USER}>`,
        to: recipient,
        replyTo: `"${name}" <${email}>`,
        subject: `⚡ [Portfolio Lead] ${finalSubject} - from ${name}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #06070d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #06070d; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #0c0e17; border: 1px solid #1e2235; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" cellspacing="0" cellpadding="0">
          
          <!-- Top Cyber Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #00f0ff 0%, #b026ff 50%, #3b82f6 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 20px; font-size: 11px; font-weight: 700; color: #00f0ff; letter-spacing: 1px; text-transform: uppercase;">
                      ● NEW PORTFOLIO LEAD INQUIRY
                    </span>
                    <h1 style="margin: 14px 0 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      You received a new message!
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #718096;">
                      Received on ${timestamp} IST
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Box -->
          <tr>
            <td style="padding: 0 32px;">
              <table role="presentation" width="100%" style="background-color: #121524; border: 1px solid #1f253d; border-radius: 12px; padding: 18px 20px;" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #8a99ad; width: 90px; vertical-align: top;">
                          <strong>From:</strong>
                        </td>
                        <td style="padding: 6px 0; font-size: 15px; color: #ffffff; font-weight: 600;">
                          ${name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #8a99ad; width: 90px; vertical-align: top;">
                          <strong>Email:</strong>
                        </td>
                        <td style="padding: 6px 0; font-size: 15px;">
                          <a href="mailto:${email}" style="color: #00f0ff; text-decoration: none; font-weight: 500;">${email}</a>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #8a99ad; width: 90px; vertical-align: top;">
                          <strong>Phone:</strong>
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #e2e8f0;">
                          ${phone}
                        </td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #8a99ad; width: 90px; vertical-align: top;">
                          <strong>Subject:</strong>
                        </td>
                        <td style="padding: 6px 0; font-size: 15px; color: #b026ff; font-weight: 600;">
                          ${finalSubject}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 24px 32px 10px 32px;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.8px;">
                MESSAGE CONTENT:
              </p>
              <div style="background-color: #121524; border-left: 4px solid #00f0ff; border-radius: 4px 10px 10px 4px; padding: 20px; font-size: 15px; color: #f0f4f8; line-height: 1.7; white-space: pre-wrap; word-break: break-word;">
${message}
              </div>
            </td>
          </tr>

          <!-- Quick Reply CTA Button -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 30px; background: linear-gradient(90deg, #00f0ff 0%, #3b82f6 100%);">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(finalSubject)}" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #05050a; text-decoration: none; border-radius: 30px; letter-spacing: 0.3px;">
                      ✉ Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #080910; border-top: 1px solid #181c2d; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Portfolio Lead Notification • <a href="http://localhost:3000" style="color: #00f0ff; text-decoration: none;">Madhala Siva Narayana Surya Chandra</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
      console.log(`✅ Contact notification email sent successfully to ${recipient} (Message ID: ${mailInfo.messageId})`);
      emailSent = true;
    } catch (mailError) {
      console.error("❌ SMTP email sending error:", mailError);
      emailErrorMsg = mailError.message;
    }

    res.json({ success: true, id: contactMessage.id, emailSent, error: emailErrorMsg });
  } catch (error) {
    console.error("❌ Contact submission failed:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ═══════════════════════════════════════
// ADMIN AUTHENTICATION
// ═══════════════════════════════════════

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password required" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ═══════════════════════════════════════
// ADMIN PROTECTED ROUTES
// ═══════════════════════════════════════

// Projects CRUD
app.get("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, image, techStack, link, github, metrics, featured } =
      req.body;
    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        techStack,
        link,
        github,
        metrics,
        featured: featured || false,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, image, techStack, link, github, metrics, featured } =
      req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        image,
        techStack,
        link,
        github,
        metrics,
        featured: featured || false,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Skills CRUD
app.get("/api/admin/skills", authMiddleware, async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" },
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

app.post("/api/admin/skills", authMiddleware, async (req, res) => {
  try {
    const { category, name, level } = req.body;
    const skill = await prisma.skill.create({
      data: { category, name, level },
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to create skill" });
  }
});

app.put("/api/admin/skills/:id", authMiddleware, async (req, res) => {
  try {
    const { category, name, level } = req.body;
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: { category, name, level },
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to update skill" });
  }
});

app.delete("/api/admin/skills/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// Experience CRUD
app.get("/api/admin/experience", authMiddleware, async (req, res) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

app.post("/api/admin/experience", authMiddleware, async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, location, current } =
      req.body;
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        current: current || false,
      },
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to create experience" });
  }
});

app.put("/api/admin/experience/:id", authMiddleware, async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, location, current } =
      req.body;
    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data: {
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        current: current || false,
      },
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to update experience" });
  }
});

app.delete("/api/admin/experience/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

// Education CRUD
app.get("/api/admin/education", authMiddleware, async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: "desc" },
    });
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

app.post("/api/admin/education", authMiddleware, async (req, res) => {
  try {
    const { school, degree, field, startDate, endDate, details } = req.body;
    const education = await prisma.education.create({
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        details,
      },
    });
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to create education" });
  }
});

app.put("/api/admin/education/:id", authMiddleware, async (req, res) => {
  try {
    const { school, degree, field, startDate, endDate, details } = req.body;
    const education = await prisma.education.update({
      where: { id: req.params.id },
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        details,
      },
    });
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to update education" });
  }
});

app.delete("/api/admin/education/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.education.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete education" });
  }
});

// Profile CRUD
app.get("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, title, bio, profileImage, resumeUrl, location, socialLinks } =
      req.body;
    const profile = await prisma.profile.create({
      data: {
        name,
        email,
        phone,
        title,
        bio,
        profileImage,
        resumeUrl,
        location,
        socialLinks,
      },
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to create profile" });
  }
});

app.put("/api/admin/profile/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, title, bio, profileImage, resumeUrl, location, socialLinks } =
      req.body;
    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        phone,
        title,
        bio,
        profileImage,
        resumeUrl,
        location,
        socialLinks,
      },
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Messages
app.get("/api/admin/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Settings
app.get("/api/admin/settings", authMiddleware, async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post("/api/admin/settings", authMiddleware, async (req, res) => {
  try {
    const { siteName, siteDescription, keywords, siteUrl, socialLinks } = req.body;
    const settings = await prisma.siteSettings.create({
      data: {
        siteName,
        siteDescription,
        keywords,
        siteUrl,
        socialLinks,
      },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to create settings" });
  }
});

app.put("/api/admin/settings/:id", authMiddleware, async (req, res) => {
  try {
    const { siteName, siteDescription, keywords, siteUrl, socialLinks } = req.body;
    const settings = await prisma.siteSettings.update({
      where: { id: req.params.id },
      data: {
        siteName,
        siteDescription,
        keywords,
        siteUrl,
        socialLinks,
      },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: `Backend running on port ${PORT}` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n✅ Backend API Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📊 Database: 44.222.126.134:1235/portfolio_db\n`);
});
