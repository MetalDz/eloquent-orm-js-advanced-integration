import { Post } from "../models/Post";

export class PostService {
  async all() {
    return new Post().all();
  }

  async find(id: number | string) {
    return Post.find(id);
  }

  async create(data: Record<string, unknown>) {
    return Post.create(data);
  }

  async createMany(rows: Record<string, unknown>[]) {
    return Post.createMany(rows);
  }

  async update(id: number | string, data: Record<string, unknown>) {
    const model = (await Post.find(id)) as (Post & {
      update(data: Record<string, unknown>): Post;
      save(): Promise<void>;
    }) | null;
    if (!model) return null;

    model.update(data);
    await model.save();
    return model;
  }

  async delete(id: number | string) {
    return Post.deleteById(id);
  }

  async restore(id: number | string) {
    return Post.restoreById(id);
  }

  async updateMany(ids: Array<number | string>, data: Record<string, unknown>) {
    return Post.updateMany(ids, data);
  }
}
