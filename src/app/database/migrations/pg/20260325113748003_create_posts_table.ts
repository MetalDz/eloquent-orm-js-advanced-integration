/**
 * Auto-generated CREATE migration for Post
 * Connection: pg
 * Mode: DEVELOPMENT
 * Generated at 2026-03-25T11:37:52.892Z
 */
export async function up(db: { query(sql: string): Promise<void> }) {
  await db.query(`CREATE TABLE IF NOT EXISTS "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "excerpt" VARCHAR(255),
  "body" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "published_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);`);
}

export async function down(db: { query(sql: string): Promise<void> }) {
  await db.query(`DROP TABLE IF EXISTS "posts";`);
}
