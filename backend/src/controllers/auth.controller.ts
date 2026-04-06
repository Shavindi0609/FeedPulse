import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Hardcoded Admin Credentials
  const ADMIN_EMAIL = "admin@feedpulse.com";
  const ADMIN_PASSWORD = "admin123"; // after .env 

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: 'admin' }, 
      process.env.JWT_SECRET || 'supersecret', 
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      message: "Login successful"
    });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
};