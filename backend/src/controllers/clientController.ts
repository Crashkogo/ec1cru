import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { z } from 'zod';

const prisma = new PrismaClient();

// Схема валидации для создания клиента
const createClientSchema = z.object({
  inn: z.string().min(10, 'ИНН должен содержать минимум 10 цифр').max(12, 'ИНН не должен превышать 12 цифр'),
  name: z.string().min(1, 'Наименование обязательно'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  managerId: z.number().int().positive('Менеджер обязателен'),
});

// Схема валидации для обновления клиента
const updateClientSchema = z.object({
  inn: z.string().min(10).max(12).optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  managerId: z.number().int().positive().optional(),
});

// Схема валидации для логина клиента
const loginClientSchema = z.object({
  inn: z.string().min(10),
  password: z.string().min(6),
});

// Получить всех клиентов (с поддержкой React-Admin пагинации)
export const getClients: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    const sortField = (req.query._sort as string) || 'id';
    const sortOrder = (req.query._order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        include: {
          manager: true, // Включаем данные менеджера
        },
        orderBy,
        skip,
        take,
      }),
      prisma.client.count(),
    ]);

    // Исключаем passwordHash из ответа
    const clientsWithoutPassword = clients.map(({ passwordHash, ...client }) => client);

    res.set('X-Total-Count', total.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(clientsWithoutPassword);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Получить клиента по ID
export const getClientById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: {
        manager: true,
      },
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    const { passwordHash, ...clientWithoutPassword } = client;
    res.status(200).json(clientWithoutPassword);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создать нового клиента
export const createClient: RequestHandler = async (req, res) => {
  try {
    const validatedData = createClientSchema.parse(req.body);
    const { inn, name, password, managerId } = validatedData;

    // Проверяем, существует ли клиент с таким ИНН
    const existingClient = await prisma.client.findUnique({ where: { inn } });
    if (existingClient) {
      res.status(400).json({ message: 'Клиент с таким ИНН уже существует' });
      return;
    }

    // Проверяем, существует ли менеджер
    const manager = await prisma.employee.findUnique({ where: { id: managerId } });
    if (!manager) {
      res.status(400).json({ message: 'Менеджер не найден' });
      return;
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = await prisma.client.create({
      data: {
        inn,
        name,
        passwordHash,
        managerId,
      },
      include: {
        manager: true,
      },
    });

    const { passwordHash: _, ...clientWithoutPassword } = newClient;
    res.status(201).json(clientWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error creating client:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Обновить клиента
export const updateClient: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateClientSchema.parse(req.body);
    const { inn, name, password, managerId } = validatedData;

    const existingClient = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (!existingClient) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    // Если менеджер указан, проверяем его существование
    if (managerId) {
      const manager = await prisma.employee.findUnique({ where: { id: managerId } });
      if (!manager) {
        res.status(400).json({ message: 'Менеджер не найден' });
        return;
      }
    }

    const updateData: any = {};
    if (inn) updateData.inn = inn;
    if (name) updateData.name = name;
    if (managerId) updateData.managerId = managerId;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        manager: true,
      },
    });

    const { passwordHash, ...clientWithoutPassword } = updatedClient;
    res.status(200).json(clientWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error updating client:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Удалить клиента
export const deleteClient: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    await prisma.client.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Client deleted successfully', id: Number(id) });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Логин клиента (отдельный эндпоинт для ЛК)
export const loginClient: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginClientSchema.parse(req.body);
    const { inn, password } = validatedData;

    const client = await prisma.client.findUnique({
      where: { inn },
      include: { manager: true },
    });

    if (!client) {
      console.log('⚠️  Client login failed: Client not found -', inn);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, client.passwordHash);
    if (!isPasswordValid) {
      console.log('⚠️  Client login failed: Invalid password for INN -', inn);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Создаем JWT токен для клиента с ролью CLIENT
    const token = jwt.sign(
      { id: client.id, role: 'CLIENT', type: 'client' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ Client login successful:', client.name, '- INN:', inn);

    res.status(200).json({
      message: 'Login successful',
      token,
      role: 'CLIENT',
      client: {
        id: client.id,
        inn: client.inn,
        name: client.name,
        manager: {
          firstName: client.manager.firstName,
          lastName: client.manager.lastName,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('❌ Error during client login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Получить текущего клиента (для ЛК)
export const getCurrentClient: RequestHandler = async (req, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        manager: true,
      },
    });

    if (!client) {
      res.status(404).json({ message: 'Клиент не найден' });
      return;
    }

    const { passwordHash, ...clientWithoutPassword } = client;
    res.json(clientWithoutPassword);
  } catch (error) {
    console.error('Ошибка при получении клиента:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
