import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { z } from 'zod';
import { path, fs, __dirname } from '../utils/index.js';

const prisma = new PrismaClient();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/x-png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Схема валидации для создания сотрудника
const createEmployeeSchema = z.object({
  firstName:  z.string().min(1, 'Имя обязательно'),
  lastName:   z.string().min(1, 'Фамилия обязательна'),
  department: z.enum(['1C', 'TECH']).optional(),
});

// Схема валидации для обновления сотрудника
const updateEmployeeSchema = z.object({
  firstName:  z.string().min(1, 'Имя обязательно').optional(),
  lastName:   z.string().min(1, 'Фамилия обязательна').optional(),
  department: z.enum(['1C', 'TECH']).nullable().optional(),
});

// Получить всех сотрудников (с поддержкой React-Admin пагинации)
export const getEmployees: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    const sortField = (req.query._sort as string) || 'id';
    const sortOrder = (req.query._order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    // Фильтр по направлению (department), если передан
    const where: any = {};
    const departmentFilter = req.query.department as string | undefined;
    if (departmentFilter === '1C' || departmentFilter === 'TECH') {
      where.department = departmentFilter;
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.employee.count({ where }),
    ]);

    res.set('X-Total-Count', total.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Получить сотрудника по ID
export const getEmployeeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// БЕЗОПАСНОСТЬ: Создание сотрудников доступно только администраторам
export const createEmployee: RequestHandler = async (req, res) => {
  try {
    // Проверка роли администратора
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Only admins can create employees' });
      return;
    }

    const validatedData = createEmployeeSchema.parse(req.body);
    const { firstName, lastName, department } = validatedData;

    const newEmployee = await prisma.employee.create({
      data: { firstName, lastName, department: department ?? null },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// БЕЗОПАСНОСТЬ: Обновление сотрудников доступно только администраторам
export const updateEmployee: RequestHandler = async (req, res) => {
  try {
    // Проверка роли администратора
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Only admins can update employees' });
      return;
    }

    const { id } = req.params;
    const validatedData = updateEmployeeSchema.parse(req.body);
    const { firstName, lastName, department } = validatedData;

    const existingEmployee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (department !== undefined) updateData.department = department;

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// БЕЗОПАСНОСТЬ: Удаление сотрудников доступно только администраторам
export const deleteEmployee: RequestHandler = async (req, res) => {
  try {
    // Проверка роли администратора
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Only admins can delete employees' });
      return;
    }

    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    await prisma.employee.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Employee deleted successfully', id: Number(id) });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// БЕЗОПАСНОСТЬ: Загрузка фото сотрудника доступна только администраторам
export const uploadEmployeePhoto: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Only admins can upload photos' });
      return;
    }

    const { id } = req.params;
    const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    if (!req.files?.photo) {
      res.status(400).json({ message: 'Файл не передан (поле: photo)' });
      return;
    }

    const photo = req.files.photo as UploadedFile;

    if (!ALLOWED_MIME_TYPES.includes(photo.mimetype)) {
      res.status(400).json({ message: 'Недопустимый тип файла. Допустимы: JPG, PNG, WEBP' });
      return;
    }
    const ext = path.extname(photo.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      res.status(400).json({ message: 'Недопустимое расширение файла' });
      return;
    }

    const uploadDir = path.join(__dirname, '../../frontend/public/uploads/employees', id);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Удаляем старую фотографию, если она есть
    if (employee.photoUrl) {
      const oldFilePath = path.join(__dirname, '../../frontend/public', employee.photoUrl);
      if (fs.existsSync(oldFilePath)) {
        try { fs.unlinkSync(oldFilePath); } catch { /* игнорируем */ }
      }
    }

    const fileName = 'photo' + ext;
    const filePath = path.join(uploadDir, fileName);
    await photo.mv(filePath);

    const photoUrl = '/uploads/employees/' + id + '/' + fileName;
    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { photoUrl },
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error uploading employee photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
