/**
 * Auto-generated CREATE migration for post_user_pivot
 * Connection: pg
 * Mode: DEVELOPMENT
 * Generated at 2026-03-25T11:37:52.893Z
 */
export async function up(db: { query(sql: string): Promise<void> }) {
  await db.query(`CREATE TABLE IF NOT EXISTS "post_user_pivot" (
  "post_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  PRIMARY KEY ("post_id", "user_id"),
  FOREIGN KEY ("post_id") REFERENCES "posts"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);`);
}

export async function down(db: { query(sql: string): Promise<void> }) {
  await db.query(`DROP TABLE IF EXISTS "post_user_pivot";`);
}