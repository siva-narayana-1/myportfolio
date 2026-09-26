import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

async function main() {
  try {
    console.log("🚀 Initializing database...");

    // Create admin user
    const existingAdmin = await db.admin.findUnique({
      where: { email: "admin@portfolio.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");
      const admin = await db.admin.create({
        data: {
          email: "admin@portfolio.com",
          password: hashedPassword,
        },
      });
      console.log("✅ Admin user created:", admin.email);
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create default profile
    const existingProfile = await db.profile.findFirst();
    if (!existingProfile) {
      const profile = await db.profile.create({
        data: {
          name: "Your Name",
          email: "your@email.com",
          title: "Full Stack Developer",
          bio: "I build digital experiences with modern technologies.",
          profileImage: "",
          location: "Your Location",
          socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
          },
        },
      });
      console.log("✅ Default profile created");
    } else {
      console.log("ℹ️  Profile already exists");
    }

    // Create default settings
    const existingSettings = await db.siteSettings.findFirst();
    if (!existingSettings) {
      await db.siteSettings.create({
        data: {
          siteName: "Your Portfolio",
          siteDescription: "Welcome to my portfolio",
          keywords: "developer, portfolio",
          siteUrl: "https://yourportfolio.com",
        },
      });
      console.log("✅ Site settings created");
    } else {
      console.log("ℹ️  Site settings already exist");
    }

    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
