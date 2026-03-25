import {
  SqlModel,
  type ModelInstance,
  column,
  relation,
  validate,
  type SchemaField,
} from "@alpha.consultings/eloquent-orm.js";

type RefreshTokenAttrs = {
  id?: number | null;
  user_id?: number | null;
  token_hash?: string | null;
  jti?: string | null;
  expires_at?: string | Date | null;
  revoked_at?: string | Date | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class RefreshToken extends SqlModel<RefreshTokenAttrs> {
  static tableName = "refresh_tokens";
  static connectionName = process.env.DB_CONNECTION ?? "pg";

  static schema = {
    id: column("increments", undefined, { primary: true }),
    user_id: column("int", undefined, { notNull: true }),
    token_hash: validate(column("string", 255), { required: true, min: 16 }),
    jti: validate(column("string", 255), { required: true, min: 16 }),
    expires_at: column("timestamp", undefined, { notNull: true }),
    revoked_at: column("timestamp"),
    created_at: column("timestamp"),
    updated_at: column("timestamp"),
    user: relation("belongsTo", "User", { foreignKey: "user_id" }),
  } satisfies Record<string, SchemaField>;

  constructor() {
    super("refresh_tokens", process.env.DB_CONNECTION ?? "pg");
  }
}

export interface RefreshToken extends ModelInstance<RefreshTokenAttrs> {}
