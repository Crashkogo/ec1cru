import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Схема валидации для создания сотрудника
const createEmployeeSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
});

// Схема валидации для обновления сотрудника
const updateEmployeeSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
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

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        orderBy,
        skip,
        take,
      }),
      prisma.employee.count(),
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

// Создать нового сотрудника
export const createEmployee: RequestHandler = async (req, res) => {
  try {
    const validatedData = createEmployeeSchema.parse(req.body);
    const { firstName, lastName } = validatedData;

    const newEmployee = await prisma.employee.create({
      data: { firstName, lastName },
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

// Обновить сотрудника
export const updateEmployee: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateEmployeeSchema.parse(req.body);
    const { firstName, lastName } = validatedData;

    const existingEmployee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEmployee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { firstName, lastName },
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

// Удалить сотрудника
export const deleteEmployee: RequestHandler = async (req, res) => {
  try {
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
