import dotenv from "dotenv";

dotenv.config();

// ========== БЕЗОПАСНОСТЬ: КРИТИЧЕСКИЕ ПЕРЕМЕННЫЕ ==========
// Критические секреты ОБЯЗАТЕЛЬНЫ в production. Если не заданы - приложение не запустится.
// Это предотвращает использование слабых дефолтных значений в production.

function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];

  // В development разрешаем дефолтные значения для удобства
  if (!value && process.env.NODE_ENV !== 'production' && defaultValue) {
    console.warn(`⚠️  WARNING: Using default value for ${name}. Set this in .env for production!`);
    return defaultValue;
  }

  // В production требуем обязательное наличие переменной
  if (!value) {
    throw new Error(`❌ FATAL: Environment variable ${name} is required but not set. Please configure .env file.`);
  }

  return value;
}

// Порт может иметь дефолтное значение в любом окружении
export const PORT = Number(process.env.PORT) || 5000;

// КРИТИЧЕСКИЕ СЕКРЕТЫ - обязательны в production
export const JWT_SECRET = requireEnv('JWT_SECRET', 'dev-secret-key-change-in-production');
export const DATABASE_URL = requireEnv('DATABASE_URL', 'postgresql://user:password@localhost:5432/mydb');
export const CAPTCHA_SECRET = requireEnv('CAPTCHA_SECRET', 'dev-captcha-secret');
export const UNSUBSCRIBE_SECRET = requireEnv('UNSUBSCRIBE_SECRET', 'dev-unsubscribe-secret');

// EMAIL переменные могут иметь дефолты для локальной разработки
export const EMAIL_USER = process.env.EMAIL_USER || "email";
export const EMAIL_PASS = process.env.EMAIL_PASS || "password";
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Переменные для отправки заявок
export const EMAIL_CALL_OUT = process.env.EMAIL_CALL_OUT;
export const EMAIL_PASS_OUT = process.env.EMAIL_PASS_OUT;
export const EMAIL_CALL_IN = process.env.EMAIL_CALL_IN;