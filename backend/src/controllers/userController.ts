import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const prisma = new PrismaClient();

export const registerUser: RequestHandler = async (req, res) => {
  const { name, password, role } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: 'Name and password are required' });
    return;
  }

  const validRoles = ['ADMIN', 'MODERATOR', 'EVENTORG', 'CLINE', 'ITS', 'DEVDEP'];
  if (role && !validRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role' });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      res.status(400).json({ message: 'User with this name already exists' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: 'Name and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, password, role } = req.body;

  if (!name || !password || !role) {
    res.status(400).json({ message: 'Name, password, and role are required' });
    return;
  }

  const validRoles = ['ADMIN', 'MODERATOR', 'EVENTORG', 'CLINE', 'ITS', 'DEVDEP'];
  if (!validRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role' });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};