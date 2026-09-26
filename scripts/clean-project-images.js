require("dotenv").config({ path: "./.env" });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanProjectImages() {
  try {
    const projects = await prisma.project.findMany();
    console.log(`Found ${projects.length} projects`);

    for (const project of projects) {
      if (project.image && (project.image.includes("via.placeholder.com") || project.image.includes("placeholder"))) {
        console.log(`Clearing dead placeholder image for: "${project.title}" (was: ${project.image})`);
        await prisma.project.update({
          where: { id: project.id },
          data: { image: "" },
        });
      }
    }

    console.log("✅ Successfully cleaned all dead placeholder image URLs from database!");
  } catch (error) {
    console.error("Error updating project images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanProjectImages();
