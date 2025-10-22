import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      username: string;
      role?: "user" | "admin";
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface AuthenticatedRequest extends Express.Request {
  user: Express.UserPayload;
}