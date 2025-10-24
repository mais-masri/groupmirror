import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten() });
      return;
    }
    next();
  };
}





