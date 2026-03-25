import type { Request, Response } from "express";
import { CommentService } from "../services/CommentService";

export class CommentController {
  private service = new CommentService();

  // GET /comment
  async index(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.all();
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  }

  // GET /comment/:id
  async show(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      const item = id ? await this.service.find(id) : null;
      if (!item) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(item);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  }

  // POST /comment
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

  // PUT /comment/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      if (id === undefined) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      const payload = req.body as Record<string, unknown>;
      await this.service.update(id, payload);
      res.json({ message: "Comment updated successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: message });
    }
  }

  // DELETE /comment/:id
  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params?.id as unknown as string | number | undefined;
      if (id === undefined) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      await this.service.delete(id);
      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(400).json({ error: message });
    }
  }

  
}