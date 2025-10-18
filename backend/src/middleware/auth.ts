import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return required ? res.status(401).json({ message: "No token" }) : next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        email: string;
        role?: "user" | "admin";
      };
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

