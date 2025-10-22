import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }
    next();
  };
}





