import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    const { name, password, role } = req.body;
  
    // Проверка наличия обязательных полей
    if (!name || !password) {
      res.status(400).json({ message: 'Name and password are required' });
      return;
    }
  
    try {
      // Проверка, существует ли пользователь с таким именем
      const existingUser = await prisma.user.findUnique({
        where: { name },
      });
  
      if (existingUser) {
        res.status(400).json({ message: 'User with this name already exists' });
        return;
      }
  
      // Хеширование пароля
      const saltRounds = 10; // Количество раундов хеширования
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Создание пользователя в базе данных
      const newUser = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          role: role || 'USER', // Роль по умолчанию
        },
      });
  
      // Отправка ответа без пароля
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const loginUser = async (req: Request, res: Response) => {
    const { name, password } = req.body;
  
    // Проверка наличия обязательных полей
    if (!name || !password) {
      res.status(400).json({ message: 'Name and password are required' });
      return;
    }
  
    try {
      // Поиск пользователя по имени
      const user = await prisma.user.findUnique({
        where: { name },
      });
  
      if (!user) {
        res.status(401).json({ message: 'Invalid name or password' });
        return;
      }
  
      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid name or password' });
        return;
      }
  
      // Генерация JWT-токена
      const token = jwt.sign(
        { id: user.id, role: user.role }, // Payload (данные, которые будут в токене)
        JWT_SECRET, // Секретный ключ из config.ts
        { expiresIn: '1h' } // Время жизни токена
      );
  
      // Отправка ответа с токеном
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };