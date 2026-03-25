import { User } from "../../models/User";
import { Post } from "../../models/Post";
import { PasswordService } from "../../auth/PasswordService";

const passwordService = new PasswordService();
const seededTitles = [
  "Launch checklist for the integration blog",
  "JWT refresh token flow under PostgreSQL",
  "Memcached response caching for public posts",
];

export async function BlogScenarioSeeder() {
  const { faker } = await import("@faker-js/faker");
  const adminPasswordHash = passwordService.hash("Password123!");
  const existingAdmin = await User.findOneBy("email", "admin@example.com");
  const existingAuthor = await User.findOneBy("email", "writer@example.com");

  const admin =
    existingAdmin ??
    (await User.create({
      name: "Admin Author",
      email: "admin@example.com",
      password_hash: adminPasswordHash,
      role: "admin",
    }));

  const author =
    existingAuthor ??
    (await User.create({
      name: "Feature Writer",
      email: "writer@example.com",
      password_hash: adminPasswordHash,
      role: "author",
    }));

  const seededUsers = [admin, author].filter(Boolean) as User[];

  for (const user of seededUsers) {
    for (let index = 0; index < seededTitles.length; index += 1) {
      const title = `${seededTitles[index]} ${user.id}`;
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}-${user.id}`;
      const existingPost = await Post.findOneBy("slug", slug);
      if (existingPost) {
        continue;
      }

      await Post.create({
        title,
        slug,
        excerpt: faker.lorem.sentence({ min: 6, max: 12 }),
        body: faker.lorem.paragraphs({ min: 2, max: 3 }),
        user_id: Number(user.id),
        published_at: new Date().toISOString(),
      });
    }
  }
}
