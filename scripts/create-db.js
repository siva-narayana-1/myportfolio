const { Client } = require("pg");

async function createDatabase() {
  console.log("🗄️  Creating database...\n");

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  // Parse connection string to get database name
  const dbUrl = new URL(connectionString);
  const dbName = dbUrl.pathname.slice(1); // Remove leading /

  // Create connection to postgres (default database)
  const adminConnectionString = connectionString.replace(`/${dbName}`, "/postgres");

  try {
    const client = new Client({
      connectionString: adminConnectionString,
    });

    await client.connect();
    console.log(`✅ Connected to server at ${dbUrl.hostname}:${dbUrl.port}\n`);

    // Check if database exists
    const result = await client.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length > 0) {
      console.log(`ℹ️  Database '${dbName}' already exists`);
      await client.end();
      return;
    }

    // Create database
    console.log(`📝 Creating database '${dbName}'...`);
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database '${dbName}' created successfully!\n`);

    await client.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createDatabase();
