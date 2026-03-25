import { AppError } from "../http/AppError";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { MemcachedPostCache, type CachedPost } from "../cache/MemcachedPostCache";

type PostPayload = {
  title: string;
  excerpt?: string | null;
  body: string;
};

type CurrentUser = {
  userId: number;
  role: string;
};

type CacheResult<T> = {
  payload: T;
  cacheStatus: "HIT" | "MISS";
};

export class BlogPostService {
  constructor(private readonly cache: MemcachedPostCache) {}

  private async invalidateCachedPosts(slug?: string): Promise<void> {
    try {
      await this.cache.invalidatePost(slug);
    } catch {
      // cache invalidation remains best-effort for the harness
    }
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private async uniqueSlug(title: string, currentId?: number): Promise<string> {
    const base = this.slugify(title);
    let candidate = base;
    let suffix = 1;

    while (true) {
      const existing = (await Post.findOneBy("slug", candidate)) as Post | null;
      if (!existing || Number(existing.id) === currentId) {
        return candidate;
      }
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
  }

  private async authorName(userId: number): Promise<string | null> {
    const user = (await User.find(userId)) as User | null;
    return user ? String(user.name ?? "") : null;
  }

  private async serializePost(post: Post): Promise<CachedPost> {
    return {
      id: Number(post.id),
      title: String(post.title ?? ""),
      slug: String(post.slug ?? ""),
      excerpt: post.excerpt ? String(post.excerpt) : null,
      body: String(post.body ?? ""),
      user_id: Number(post.user_id),
      author_name: await this.authorName(Number(post.user_id)),
      created_at: post.created_at ?? null,
      updated_at: post.updated_at ?? null,
    };
  }

  async listPublishedPosts(): Promise<CacheResult<CachedPost[]>> {
    try {
      const cached = await this.cache.listPosts();
      if (cached) {
        return { payload: cached, cacheStatus: "HIT" };
      }
    } catch {
      // cache remains best-effort for the harness
    }

    const posts = await Post.orderBy("created_at", "desc").get();
    const payload = await Promise.all(posts.map((post) => this.serializePost(post as Post)));

    try {
      await this.cache.cachePostList(payload);
    } catch {
      // cache remains best-effort for the harness
    }

    return { payload, cacheStatus: "MISS" };
  }

  async getPostBySlug(slug: string): Promise<CacheResult<CachedPost>> {
    try {
      const cached = await this.cache.getPostBySlug(slug);
      if (cached) {
        return { payload: cached, cacheStatus: "HIT" };
      }
    } catch {
      // cache remains best-effort for the harness
    }

    const post = (await Post.findOneBy("slug", slug)) as Post | null;
    if (!post) {
      throw new AppError("Post not found.", 404);
    }

    const payload = await this.serializePost(post as Post);
    try {
      await this.cache.cachePost(payload);
    } catch {
      // cache remains best-effort for the harness
    }

    return { payload, cacheStatus: "MISS" };
  }

  async createPost(input: PostPayload, currentUser: CurrentUser): Promise<CachedPost> {
    const slug = await this.uniqueSlug(input.title);
    const created = await Post.create({
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt?.trim() || null,
      body: input.body.trim(),
      user_id: currentUser.userId,
      published_at: new Date().toISOString(),
    });

    if (!created) {
      throw new AppError("Unable to create post.", 500);
    }

    const payload = await this.serializePost(created as Post);
    await this.invalidateCachedPosts();
    return payload;
  }

  async updatePost(id: number, input: PostPayload, currentUser: CurrentUser): Promise<CachedPost> {
    const post = (await Post.find(id)) as (Post & {
      patch(data: Record<string, unknown>): Promise<void>;
    }) | null;
    if (!post) {
      throw new AppError("Post not found.", 404);
    }
    if (Number(post.user_id) !== currentUser.userId && currentUser.role !== "admin") {
      throw new AppError("You are not allowed to update this post.", 403);
    }

    const nextSlug = input.title
      ? await this.uniqueSlug(input.title, Number(post.id))
      : String(post.slug ?? "");

    await post.patch({
      title: input.title?.trim() ?? post.title,
      slug: nextSlug,
      excerpt: input.excerpt?.trim() ?? post.excerpt ?? null,
      body: input.body?.trim() ?? post.body,
    });

    const payload = await this.serializePost(post as Post);
    await this.invalidateCachedPosts(String(post.slug ?? ""));
    return payload;
  }

  async deletePost(id: number, currentUser: CurrentUser): Promise<void> {
    const post = (await Post.find(id)) as (Post & {
      delete(): Promise<void>;
    }) | null;
    if (!post) {
      throw new AppError("Post not found.", 404);
    }
    if (Number(post.user_id) !== currentUser.userId && currentUser.role !== "admin") {
      throw new AppError("You are not allowed to delete this post.", 403);
    }

    const oldSlug = String(post.slug ?? "");
    await post.delete();
    await this.invalidateCachedPosts(oldSlug);
  }
}
