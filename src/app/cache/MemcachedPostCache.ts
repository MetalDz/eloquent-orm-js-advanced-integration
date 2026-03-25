import Memcached from "memcached";
import { appEnv, memcachedServer } from "../config/env";

export type CachedPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  user_id: number;
  author_name?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class MemcachedPostCache {
  private readonly client = new Memcached(memcachedServer);
  private readonly listKey = "blog:posts:index";
  private readonly hotCache = new Map<string, unknown>();

  private get<T>(key: string): Promise<T | null> {
    if (this.hotCache.has(key)) {
      return Promise.resolve((this.hotCache.get(key) as T | null | undefined) ?? null);
    }

    return new Promise((resolve, reject) => {
      this.client.get(key, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        const value = (data as T | null | undefined) ?? null;
        if (value !== null) {
          this.hotCache.set(key, value);
        }
        resolve(value);
      });
    });
  }

  private set<T>(key: string, value: T, ttl = appEnv.memcachedTtlSeconds): Promise<void> {
    this.hotCache.set(key, value);

    return new Promise((resolve, reject) => {
      this.client.set(key, value, ttl, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  private delete(key: string): Promise<void> {
    this.hotCache.delete(key);

    return new Promise((resolve, reject) => {
      this.client.del(key, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  flushAll(): Promise<void> {
    this.hotCache.clear();

    return new Promise((resolve, reject) => {
      this.client.flush((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  listPosts(): Promise<CachedPost[] | null> {
    return this.get(this.listKey);
  }

  async cachePostList(posts: CachedPost[]): Promise<void> {
    await this.set(this.listKey, posts);
    await Promise.all(posts.map((post) => this.cachePost(post)));
  }

  getPostBySlug(slug: string): Promise<CachedPost | null> {
    return this.get(`blog:posts:${slug}`);
  }

  cachePost(post: CachedPost): Promise<void> {
    return this.set(`blog:posts:${post.slug}`, post);
  }

  async invalidatePost(slug?: string): Promise<void> {
    await this.delete(this.listKey);
    if (slug) {
      await this.delete(`blog:posts:${slug}`);
    }
  }

  close(): void {
    this.client.end();
  }
}
