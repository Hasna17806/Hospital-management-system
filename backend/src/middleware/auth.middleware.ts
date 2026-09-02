import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express's Request type so TypeScript knows req.user can exist
export interface AuthRequest extends Request {
  user?: { id: number; name: string; role: string };
}

// This function runs BEFORE the actual route handler, for any route
// it's attached to. If the token is missing or invalid, it stops the
// request right here with a 401 — the controller function never runs.
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      name: string;
      role: string;
    };
    req.user = decoded; // now available to any controller that runs after this
    next(); // continue on to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
