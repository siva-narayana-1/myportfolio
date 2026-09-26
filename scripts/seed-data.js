require("dotenv").config({ path: ".env" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedData() {
  console.log("🌱 Seeding database with sample data...\n");

  try {
    // Add sample skills
    console.log("📚 Adding skills...");
    const skills = [
      { category: "Frontend", name: "React", level: "Expert" },
      { category: "Frontend", name: "Next.js", level: "Expert" },
      { category: "Frontend", name: "TypeScript", level: "Advanced" },
      { category: "Frontend", name: "Tailwind CSS", level: "Advanced" },
      { category: "Backend", name: "Node.js", level: "Expert" },
      { category: "Backend", name: "Express", level: "Expert" },
      { category: "Backend", name: "PostgreSQL", level: "Advanced" },
      { category: "Backend", name: "Prisma", level: "Advanced" },
      { category: "Tools", name: "Git", level: "Expert" },
      { category: "Tools", name: "Docker", level: "Intermediate" },
      { category: "Tools", name: "CI/CD", level: "Intermediate" },
    ];

    for (const skill of skills) {
      await prisma.skill.create({ data: skill }).catch(() => {});
    }
    console.log(`✅ Added ${skills.length} skills\n`);

    // Add sample experience
    console.log("💼 Adding experience...");
    const experiences = [
      {
        position: "Full Stack Developer",
        company: "Tech Company Inc",
        description: "Built scalable web applications using React and Node.js",
        startDate: new Date("2022-01-15"),
        endDate: null,
        location: "San Francisco, CA",
        current: true,
      },
      {
        position: "Frontend Developer",
        company: "Digital Agency",
        description: "Developed responsive web interfaces and optimized performance",
        startDate: new Date("2020-06-01"),
        endDate: new Date("2021-12-31"),
        location: "New York, NY",
        current: false,
      },
    ];

    for (const exp of experiences) {
      await prisma.experience.create({ data: exp }).catch(() => {});
    }
    console.log(`✅ Added ${experiences.length} experiences\n`);

    // Add sample projects
    console.log("🚀 Adding projects...");
    const projects = [
      {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce platform with payment integration and inventory management",
        image: "https://via.placeholder.com/600x400?text=E-Commerce",
        techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
        link: "#",
        github: "https://github.com",
        metrics: "10k+ users, 500+ products",
        featured: true,
      },
      {
        title: "Task Management App",
        description: "Real-time collaborative task management application with team features",
        image: "https://via.placeholder.com/600x400?text=Task+Manager",
        techStack: ["Next.js", "TypeScript", "Firebase", "Tailwind"],
        link: "#",
        github: "https://github.com",
        metrics: "5k+ daily active users",
        featured: true,
      },
      {
        title: "AI Content Generator",
        description: "AI-powered content generation tool using GPT API integration",
        image: "https://via.placeholder.com/600x400?text=AI+Tool",
        techStack: ["React", "Node.js", "OpenAI", "MongoDB"],
        link: "#",
        github: "https://github.com",
        metrics: "2k+ generated pieces",
        featured: false,
      },
    ];

    for (const project of projects) {
      await prisma.project.create({ data: project }).catch(() => {});
    }
    console.log(`✅ Added ${projects.length} projects\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
