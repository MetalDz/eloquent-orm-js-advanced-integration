/**
 * Auto-generated CREATE migration for Comment
 * Connection: pg
 * Mode: DEVELOPMENT
 * Generated at 2026-03-25T11:37:52.873Z
 */
export async function up(db: { query(sql: string): Promise<void> }) {
  await db.query(`CREATE TABLE IF NOT EXISTS "comments" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "commentable_id" INTEGER NOT NULL,
  "commentable_type" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);`);
}

export async function down(db: { query(sql: string): Promise<void> }) {
  await db.query(`DROP TABLE IF EXISTS "comments";`);
}