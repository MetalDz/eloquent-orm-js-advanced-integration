import type { Request, Response } from "express";
import { PostService } from "../services/PostService";

export class PostController {
  private service = new PostService();

  // GET /post
  async index(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.all();
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  }

  // GET /post/:id
  async show(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      const item = id ? await this.service.find(id) : null;
      if (!item) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.json(item);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  }

  // POST /post
  async store(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as Record<string, unknown>;
      const created = await this.service.create(payload);
      res.status(201).json(created);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: message });
    }
  }

  // PUT /post/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      if (id === undefined) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      const payload = req.body as Record<string, unknown>;
      await this.service.update(id, payload);
      res.json({ message: "Post updated successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: message });
    }
  }

  // DELETE /post/:id
  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      if (id === undefined) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      await this.service.delete(id);
      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: message });
    }
  }

  
}