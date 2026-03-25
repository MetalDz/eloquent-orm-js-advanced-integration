/**
 * Auto-generated Test Model
 * Model: Post
 * Table: posts
 */

import { SqlModel, ModelInstance } from "@alpha.consultings/eloquent-orm.js";
import { column, relation, validate, type SchemaField } from "@alpha.consultings/eloquent-orm.js";

type PostAttrs = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  user_id?: number | null;
  published_at?: string | Date | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class Post extends SqlModel<PostAttrs> {
  static tableName = "posts";
  static connectionName = process.env.DB_CONNECTION ?? "pg";
  static morphAlias = "posts";

  static schema = {
    id: column("increments", undefined, { primary: true }),
    title: validate(column("string", 255), { required: true, min: 3 }),
    slug: validate(column("string", 255), { required: true, min: 3 }),
    excerpt: column("string", 255),
    body: validate(column("text"), { required: true, min: 10 }),
    user_id: column("int", undefined, { notNull: true }),
    published_at: column("timestamp"),
    created_at: column("timestamp"),
    updated_at: column("timestamp"),
    
    author: relation("belongsTo", "User", { foreignKey: "user_id" }),
    favoritedBy: relation("belongsToMany", "User", {}),
    comments: relation("morphMany", "Comment", { morphName: "commentable" }),

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
   *   const model = new Post();
   *   model.fill({ name: "Example" });
   *   await model.save();
   *   model.update({ name: "Example 2" });
   *   await model.save();
   *   await model.patch({ name: "Example 3" });
   * -------------------------------------------------
   */

  static validationHooks = {
    beforeValidate: async (data: Record<string, unknown>) => {
      console.log("[beforeValidate] Post", data);
    },
    afterValidate: async (data: Record<string, unknown>) => {
      console.log("[afterValidate] Post", data);
    },
  };

  static customRules = {
    isUnique: async (_value: unknown) => {
      return true;
    },
  };

  static modelEvents = {
    beforeCreate: async (data: Record<string, unknown>) => {
      console.log("[beforeCreate] Post", data);
    },
    afterCreate: async (record: Record<string, unknown> | null) => {
      console.log("[afterCreate] Post created:", record);
    },
    beforeUpdate: async (data: Record<string, unknown>) => {
      console.log("[beforeUpdate] Post", data);
    },
    afterUpdate: async (data: Record<string, unknown>) => {
      console.log("[afterUpdate] Post updated:", data);
    },
    beforeDelete: async (id: number | string) => {
      console.log("[beforeDelete] Post", id);
    },
    afterDelete: async (id: number | string) => {
      console.log("[afterDelete] Post", id);
    },
  };

  constructor() {
    super("posts", process.env.DB_CONNECTION ?? "pg");
  }
}

export interface Post extends ModelInstance<PostAttrs> {}
