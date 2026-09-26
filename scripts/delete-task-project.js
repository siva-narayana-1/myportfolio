require("dotenv").config({ path: "./.env" });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteProject() {
  try {
    const deleted = await prisma.project.deleteMany({
      where: {
        title: {
          contains: "Task Management",
          mode: "insensitive",
        },
      },
    });
    console.log("Successfully deleted:", deleted.count, "project(s)");

    const remaining = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
    console.log(`Remaining projects count: ${remaining.length}`);
    remaining.forEach((p, idx) => console.log(`  ${idx + 1}. ${p.title}`));
  } catch (error) {
    console.error("Error deleting project:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteProject();
