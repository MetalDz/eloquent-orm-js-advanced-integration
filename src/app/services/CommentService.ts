import { Comment } from "../models/Comment";

export class CommentService {
  async all() {
    return new Comment().all();
  }

  async find(id: number | string) {
    return Comment.find(id);
  }

  async create(data: Record<string, unknown>) {
    return Comment.create(data);
  }

  async createMany(rows: Record<string, unknown>[]) {
    return Comment.createMany(rows);
  }

  async update(id: number | string, data: Record<string, unknown>) {
    const model = (await Comment.find(id)) as (Comment & {
      update(data: Record<string, unknown>): Comment;
      save(): Promise<void>;
    }) | null;
    if (!model) return null;

    model.update(data);
    await model.save();
    return model;
  }

  async delete(id: number | string) {
    return Comment.deleteById(id);
  }

  async restore(id: number | string) {
    return Comment.restoreById(id);
  }

  async updateMany(ids: Array<number | string>, data: Record<string, unknown>) {
    return Comment.updateMany(ids, data);
  }
}
