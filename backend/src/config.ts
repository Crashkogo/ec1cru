import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 5000; // ИЗМЕНЕНО: явное приведение к number
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb";
export const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || "captcha-secret";
export const EMAIL_USER = process.env.EMAIL_USER || "email";
export const EMAIL_PASS = process.env.EMAIL_PASS || "password";
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';