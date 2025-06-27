import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { z } from "zod";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  role: z
    .enum(["ADMIN", "MODERATOR", "EVENTORG", "CLINE", "ITS", "DEVDEP"])
    .optional(),
});

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, password, role } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      res.status(400).json({ message: "User with this name already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, password: hashedPassword, role: role || "USER" },
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
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
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
// backend/src/controllers/userController.ts
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DeleteUser: req.user:", JSON.stringify(req.user, null, 2)); // Отладка
    console.log("DeleteUser: token:", req.headers.authorization); // Отладка

    if (!req.user) {
      console.log("DeleteUser: No user data in request");
      res.status(401).json({ message: "Unauthorized: No user data" });
      return;
    }

    if (req.user.role !== "ADMIN") {
      console.log("DeleteUser: User role is not ADMIN:", req.user.role);
      res
        .status(403)
        .json({ message: "Forbidden: Only admins can delete users" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      console.log("DeleteUser: User not found, ID:", id);
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    console.log("DeleteUser: User deleted, ID:", id);
    res
      .status(200)
      .json({ message: "User deleted successfully", id: Number(id) });
  } catch (error) {
    console.error("DeleteUser: Error:", error);
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
