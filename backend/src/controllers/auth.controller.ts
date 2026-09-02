import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find the user by email
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    // Deliberately vague error message ("Invalid email or password") for
    // both "user not found" and "wrong password" — this stops someone
    // from figuring out which emails are registered just by guessing.
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare the submitted password against the stored bcrypt hash.
    // bcrypt.compare hashes the input the same way and checks it matches —
    // we never decrypt the stored hash (it can't be decrypted, only compared).
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Create a signed token containing the user's id, name, and role.
    // The server can later verify this token wasn't tampered with, using
    // the same JWT_SECRET — without needing to hit the database again.
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
