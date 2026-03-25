/**
 * Auto-generated Test Model
 * Model: User
 * Table: users
 */

import { SqlModel, ModelInstance } from "@alpha.consultings/eloquent-orm.js";
import { column, relation, validate, type SchemaField } from "@alpha.consultings/eloquent-orm.js";

type UserAttrs = {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  password_hash?: string | null;
  role?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class User extends SqlModel<UserAttrs> {
  static tableName = "users";
  static connectionName = process.env.DB_CONNECTION ?? "pg";
  static morphAlias = "users";

  static schema = {
    id: column("increments", undefined, { primary: true }),
    name: validate(column("string", 255), { required: true, min: 3 }),
    email: validate(column("string", 255), { required: true, min: 5 }),
    password_hash: validate(column("string", 255), { required: true, min: 20 }),
    role: validate(column("string", 50), { required: true, min: 4 }),
    created_at: column("timestamp"),
    updated_at: column("timestamp"),
    
    posts: relation("hasMany", "Post", { foreignKey: "user_id" }),
    favorites: relation("belongsToMany", "Post", {}),
    comments: relation("morphMany", "Comment", { morphName: "commentable" }),
    refresh_tokens: relation("hasMany", "RefreshToken", { foreignKey: "user_id" }),

    /*
     * RELATIONS EXAMPLES (uncomment and adapt):
     * user: relation("belongsTo", "User", { foreignKey: "user_id" }),
     * image: relation("morphOne", "Image", { morphName: "imageable" }),
     * comments: relation("morphMany", "Comment", { morphName: "commentable" }),
     * commentable: relation("morphTo", undefined, { morphName: "commentable" }),
     */
  } satisfies Record<string, SchemaField>;

  /*
   * OPTIONAL MIXINS (uncomment as needed):
   * static timestamps = true;
   * static softDeletes = true;
   * static cacheEnabled = true;
   *
   * INSTANCE PERSISTENCE EXAMPLES
   * -------------------------------------------------
   *   const model = new User();
   *   model.fill({ name: "Example" });
   *   await model.save();
   *   model.update({ name: "Example 2" });
   *   await model.save();
   *   await model.patch({ name: "Example 3" });
   * -------------------------------------------------
   */

  static validationHooks = {
    beforeValidate: async (data: Record<string, unknown>) => {
      console.log("[beforeValidate] User", data);
    },
    afterValidate: async (data: Record<string, unknown>) => {
      console.log("[afterValidate] User", data);
    },
  };

  static customRules = {
    isUnique: async (_value: unknown) => {
      return true;
    },
  };

  static modelEvents = {
    beforeCreate: async (data: Record<string, unknown>) => {
      console.log("[beforeCreate] User", data);
    },
    afterCreate: async (record: Record<string, unknown> | null) => {
      console.log("[afterCreate] User created:", record);
    },
    beforeUpdate: async (data: Record<string, unknown>) => {
      console.log("[beforeUpdate] User", data);
    },
    afterUpdate: async (data: Record<string, unknown>) => {
      console.log("[afterUpdate] User updated:", data);
    },
    beforeDelete: async (id: number | string) => {
      console.log("[beforeDelete] User", id);
    },
    afterDelete: async (id: number | string) => {
      console.log("[afterDelete] User", id);
    },
  };

  constructor() {
    super("users", process.env.DB_CONNECTION ?? "pg");
  }
}

export interface User extends ModelInstance<UserAttrs> {}
