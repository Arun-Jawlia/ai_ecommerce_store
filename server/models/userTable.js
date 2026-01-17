import database from "../database/db.js";

export async function createUserTable() {
  try {
    const query = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 3),

        email VARCHAR(150) NOT NULL UNIQUE,

        password TEXT NOT NULL,

        role VARCHAR(10) NOT NULL DEFAULT 'User'
          CHECK (role IN ('User', 'Admin')),

        avatar JSONB DEFAULT NULL,

        reset_password_token TEXT DEFAULT NULL,
        reset_password_expire TIMESTAMPTZ DEFAULT NULL,

        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;

    await database.query(query);

    console.log("✅ Users table ready");
  } catch (error) {
    console.error("❌ Failed To Create User Table.", error);
    process.exit(1);
  }
}
