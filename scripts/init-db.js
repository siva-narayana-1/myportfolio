require("dotenv").config({ path: ".env" });

const { PrismaClient } = require("@prisma/client");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createDatabaseIfNotExists() {
  console.log("🗄️  Checking if database exists...\n");

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL not set in .env.local");
  }

  const dbUrl = new URL(connectionString);
  const dbName = dbUrl.pathname.slice(1);
  const adminConnectionString = connectionString.replace(`/${dbName}`, "/postgres");

  try {
    const client = new Client({
      connectionString: adminConnectionString,
    });

    await client.connect();

    const result = await client.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`📝 Creating database '${dbName}'...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created!\n`);
    } else {
      console.log(`✅ Database '${dbName}' already exists\n`);
    }

    await client.end();
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log(`ℹ️  Database already exists\n`);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log("🚀 Starting database initialization...\n");

  try {
    // Create database if it doesn't exist
    await createDatabaseIfNotExists();

    // Check connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully!\n");

    // Create admin user
    console.log("📝 Creating admin user...");
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "admin@portfolio.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await prisma.admin.create({
        data: {
          email: "admin@portfolio.com",
          password: hashedPassword,
        },
      });
      console.log("✅ Admin user created!");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123\n`);
    } else {
      console.log("ℹ️  Admin user already exists\n");
    }

    // Create default profile
    console.log("📝 Creating default profile...");
    const existingProfile = await prisma.profile.findFirst();
    if (!existingProfile) {
      const profile = await prisma.profile.create({
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
      console.log("✅ Default profile created!\n");
    } else {
      console.log("ℹ️  Profile already exists\n");
    }

    // Create default settings
    console.log("📝 Creating site settings...");
    const existingSettings = await prisma.siteSettings.findFirst();
    if (!existingSettings) {
      await prisma.siteSettings.create({
        data: {
          siteName: "Your Portfolio",
          siteDescription: "Welcome to my portfolio. I'm a developer.",
          keywords: "developer, portfolio, projects",
          siteUrl: "https://yourportfolio.com",
          socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
          },
        },
      });
      console.log("✅ Site settings created!\n");
    } else {
      console.log("ℹ️  Site settings already exist\n");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ Database initialization complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📋 Next steps:");
    console.log("1. Run: npm run dev");
    console.log("2. Go to: http://localhost:3000/admin/login");
    console.log("3. Login with: admin@portfolio.com / admin123");
    console.log("4. Start adding your portfolio content!\n");

  } catch (error) {
    console.error("❌ Error during initialization:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
