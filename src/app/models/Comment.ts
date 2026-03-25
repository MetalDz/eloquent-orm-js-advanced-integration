/**
 * Auto-generated Test Model
 * Model: Comment
 * Table: comments
 */

import { SqlModel, ModelInstance } from "@alpha.consultings/eloquent-orm.js";
import { column, relation, validate, type SchemaField } from "@alpha.consultings/eloquent-orm.js";

type CommentAttrs = {
  id?: number | null;
  name?: string | null;
  commentable_id?: number | null;
  commentable_type?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class Comment extends SqlModel<CommentAttrs> {
  static tableName = "comments";
  static connectionName = process.env.DB_CONNECTION ?? "pg";
  static morphAlias = "comments";

  static schema = {
    id: column("increments", undefined, { primary: true }),
    name: validate(column("string", 255), { required: true, min: 3 }),
    commentable_id: column("int", undefined, { notNull: true }),
    commentable_type: column("string", 255, { notNull: true }),
    created_at: column("timestamp"),
    updated_at: column("timestamp"),
    
    commentable: relation("morphTo", "Commentable", { morphName: "commentable" }),

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
   *   const model = new Comment();
   *   model.fill({ name: "Example" });
   *   await model.save();
   *   model.update({ name: "Example 2" });
   *   await model.save();
   *   await model.patch({ name: "Example 3" });
   * -------------------------------------------------
   */

  static validationHooks = {
    beforeValidate: async (data: Record<string, unknown>) => {
      console.log("[beforeValidate] Comment", data);
    },
    afterValidate: async (data: Record<string, unknown>) => {
      console.log("[afterValidate] Comment", data);
    },
  };

  static customRules = {
    isUnique: async (_value: unknown) => {
      return true;
    },
  };

  static modelEvents = {
    beforeCreate: async (data: Record<string, unknown>) => {
      console.log("[beforeCreate] Comment", data);
    },
    afterCreate: async (record: Record<string, unknown> | null) => {
      console.log("[afterCreate] Comment created:", record);
    },
    beforeUpdate: async (data: Record<string, unknown>) => {
      console.log("[beforeUpdate] Comment", data);
    },
    afterUpdate: async (data: Record<string, unknown>) => {
      console.log("[afterUpdate] Comment updated:", data);
    },
    beforeDelete: async (id: number | string) => {
      console.log("[beforeDelete] Comment", id);
    },
    afterDelete: async (id: number | string) => {
      console.log("[afterDelete] Comment", id);
    },
  };

  constructor() {
    super("comments", process.env.DB_CONNECTION ?? "pg");
  }
}

export interface Comment extends ModelInstance<CommentAttrs> {}
