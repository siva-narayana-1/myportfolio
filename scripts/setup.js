#!/usr/bin/env node

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
};

function log(message) {
  console.log(message);
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function main() {
  console.clear();
  log(chalk.blue("╔════════════════════════════════════════════════════════╗"));
  log(chalk.blue("║     🚀 Portfolio Database & Application Setup          ║"));
  log(chalk.blue("╚════════════════════════════════════════════════════════╝\n"));

  try {
    // Step 1: Check .env.local
    log(chalk.yellow("Step 1: Checking configuration..."));
    const envPath = path.join(__dirname, "..", ".env.local");
    if (!fs.existsSync(envPath)) {
      log(chalk.red("❌ .env.local file not found!"));
      process.exit(1);
    }
    log(chalk.green("✅ .env.local found\n"));

    // Step 2: Install dependencies
    log(chalk.yellow("Step 2: Ensuring dependencies are installed..."));
    log("This may take a moment...\n");
    try {
      await runCommand("npm list @prisma/client 2>nul");
      log(chalk.green("✅ Dependencies already installed\n"));
    } catch {
      log("Installing dependencies...");
      await runCommand("npm install");
      log(chalk.green("✅ Dependencies installed\n"));
    }

    // Step 3: Run Prisma migrations
    log(chalk.yellow("Step 3: Setting up database schema..."));
    log("Running Prisma db push...\n");
    try {
      await runCommand("npx prisma db push --skip-generate");
      log(chalk.green("✅ Database schema created\n"));
    } catch (error) {
      log(chalk.red("⚠️  Could not create database schema"));
      log("This might happen if the database server is not accessible.");
      log("The init script will still run to set up default data.\n");
    }

    // Step 4: Initialize data
    log(chalk.yellow("Step 4: Initializing default data..."));
    log("Creating admin user and default settings...\n");
    await runCommand("node scripts/init-db.js");

    // Step 5: Summary
    log(chalk.blue("\n╔════════════════════════════════════════════════════════╗"));
    log(chalk.blue("║              ✨ Setup Complete!                        ║"));
    log(chalk.blue("╚════════════════════════════════════════════════════════╝\n"));

    log(chalk.yellow("🚀 Next steps:\n"));
    log("  1. Start the development server:");
    log(chalk.green("     npm run dev\n"));

    log("  2. Open your browser to:");
    log(chalk.green("     http://localhost:3000\n"));

    log("  3. Access the admin panel:");
    log(chalk.green("     http://localhost:3000/admin/login\n"));

    log("  4. Login with:");
    log(chalk.green("     Email: admin@portfolio.com"));
    log(chalk.green("     Password: admin123\n"));

    log("  5. Start adding your portfolio content!\n");

    log(chalk.yellow("📚 Documentation:"));
    log("  • QUICK_START.md - Step-by-step guide");
    log("  • SETUP.md - Detailed documentation\n");

  } catch (error) {
    log(chalk.red(`\n❌ Error: ${error.message}\n`));
    log("Troubleshooting tips:");
    log("1. Check your .env.local file has correct DATABASE_URL");
    log("2. Make sure PostgreSQL server is running");
    log("3. Verify database credentials\n");
    process.exit(1);
  }
}

main();
