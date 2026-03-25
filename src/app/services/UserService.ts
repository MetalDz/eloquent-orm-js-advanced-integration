import { User } from "../models/User";

export class UserService {
  async all() {
    return new User().all();
  }

  async find(id: number | string) {
    return User.find(id);
  }

  async create(data: Record<string, unknown>) {
    return User.create(data);
  }

  async createMany(rows: Record<string, unknown>[]) {
    return User.createMany(rows);
  }

  async update(id: number | string, data: Record<string, unknown>) {
    const model = (await User.find(id)) as (User & {
      update(data: Record<string, unknown>): User;
      save(): Promise<void>;
    }) | null;
    if (!model) return null;

    model.update(data);
    await model.save();
    return model;
  }

  async delete(id: number | string) {
    return User.deleteById(id);
  }

  async restore(id: number | string) {
    return User.restoreById(id);
  }

  async updateMany(ids: Array<number | string>, data: Record<string, unknown>) {
    return User.updateMany(ids, data);
  }
}
