import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { z } from "zod";

const prisma = new PrismaClient();

// ========== БЕЗОПАСНОСТЬ: Регистрация без самоназначения ролей ==========
// Схема регистрации НЕ содержит поле role - роли назначает только администратор
// Все новые пользователи получают роль USER по умолчанию
const registerSchema = z.object({
  name: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  // УДАЛЕНО: role - пользователи не могут выбирать роль при регистрации
});

// Отдельная схема для создания пользователя администратором (с указанием роли)
const adminCreateUserSchema = z.object({
  name: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  role: z.enum(["ADMIN", "MODERATOR", "EVENTORG", "CLINE", "ITS", "DEVDEP"]),
});

export const registerUser: RequestHandler = async (req, res) => {
  try {
    // БЕЗОПАСНОСТЬ: Только админы могут создавать пользователей с выбором роли
    const isAdmin = req.user?.role === "ADMIN";

    const validatedData = isAdmin
      ? adminCreateUserSchema.parse(req.body)
      : registerSchema.parse(req.body);

    const { name, password } = validatedData;
    // БЕЗОПАСНОСТЬ: Роль берём из запроса только если это админ, иначе USER
    const role: string = isAdmin && 'role' in validatedData ? (validatedData as { role: string }).role : "USER";

    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      res.status(400).json({ message: "User with this name already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, password: hashedPassword, role },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, role: true },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
});

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { name, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) {
      // БЕЗОПАСНОСТЬ: Не логируем имя пользователя при неудачной попытке входа
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // БЕЗОПАСНОСТЬ: Не логируем имя пользователя при неудачной попытке входа
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // БЕЗОПАСНОСТЬ: Сокращён срок жизни токена с 30 дней до 7 дней
    // Для критичных операций рекомендуется ещё меньший срок (1-3 дня)
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // БЕЗОПАСНОСТЬ: Устанавливаем токен в HttpOnly cookie
    // HttpOnly защищает от XSS атак - токен недоступен из JavaScript
    res.cookie('authToken', token, {
      httpOnly: true,              // Недоступен из JavaScript - защита от XSS
      secure: process.env.NODE_ENV === 'production', // Только HTTPS в production
      sameSite: 'strict',          // Защита от CSRF атак
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в миллисекундах
      path: '/',                   // Доступен для всего сайта
    });

    // Также устанавливаем роль в отдельную cookie для удобства
    res.cookie('userRole', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res
      .status(200)
      .json({ message: "Login successful", role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// БЕЗОПАСНОСТЬ: Logout - очистка HttpOnly cookies
export const logoutUser: RequestHandler = (req, res) => {
  // Очищаем токен и роль из cookies
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.clearCookie('userRole', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.status(200).json({ message: "Logout successful" });
};

const getUsersSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1"))
    .default("1"),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10"))
    .default("10"),
});

export const getUsers: RequestHandler = async (req, res) => {
  try {
    // Поддержка пагинации React Admin
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    // Поддержка сортировки
    const sortField = (req.query._sort as string) || "id";
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    // Поддержка поиска и фильтрации
    const searchQuery = req.query.q as string;
    const roleFilter = req.query.role as string;

    const where: any = {};
    if (searchQuery) {
      where.name = { contains: searchQuery, mode: "insensitive" };
    }
    if (roleFilter) {
      where.role = roleFilter;
    }

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
        select: { id: true, name: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserSchema = z.object({
  name: z.string().min(3).max(50),
  password: z.string().min(6).max(100).optional(), // Сделали необязательным
  role: z.enum(["ADMIN", "MODERATOR", "EVENTORG", "CLINE", "ITS", "DEVDEP"]),
});

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);
    const { name, password, role } = validatedData;

    if (req.user?.role !== "ADMIN") {
      res
        .status(403)
        .json({ message: "Forbidden: Only admins can update users" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateData: { name: string; role: string; password?: string } = {
      name,
      role,
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
// БЕЗОПАСНОСТЬ: Удаление пользователей доступно только администраторам
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: No user data" });
      return;
    }

    if (req.user.role !== "ADMIN") {
      res
        .status(403)
        .json({ message: "Forbidden: Only admins can delete users" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    res
      .status(200)
      .json({ message: "User deleted successfully", id: Number(id) });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
