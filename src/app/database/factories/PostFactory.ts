import { Factory } from "@alpha.consultings/eloquent-orm.js";
import { Post } from "../../models/Post";

export class PostFactory extends Factory<Post> {
  model = Post;

  definition(index = 0): Partial<Post> {
    const title = this.faker.lorem.sentence({ min: 3, max: 6 }).replace(/\.$/, "");
    return {
      title,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
      excerpt: this.faker.lorem.sentence({ min: 6, max: 12 }),
      body: this.faker.lorem.paragraphs({ min: 2, max: 3 }),
      user_id: this.faker.number.int(),
    };
  }
}
