import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { z } from 'zod';
import { path, fs, __dirname } from '../utils/index.js';

const prisma = new PrismaClient();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/x-png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const VALID_SECTIONS = ['MANAGERS', 'CONSULTATION', 'ITS', 'IMPLEMENTATION', 'TECH'] as const;

const createSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName:  z.string().min(1, 'Фамилия обязательна'),
  position:  z.string().min(1, 'Должность обязательна'),
  section:   z.enum(VALID_SECTIONS),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName:  z.string().min(1).optional(),
  position:  z.string().min(1).optional(),
  section:   z.enum(VALID_SECTIONS).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

// Публичный — все сотрудники, поддержка React-Admin пагинации
export const getTeamMembers: RequestHandler = async (req, res) => {
  try {
    const start = parseInt(req.query._start as string) || 0;
    const end   = parseInt(req.query._end   as string) || 500;
    const ALLOWED_SORT_FIELDS = ['sortOrder', 'firstName', 'lastName', 'section', 'createdAt', 'id'];
    const rawSortField = (req.query._sort as string) || 'sortOrder';
    const sortField = ALLOWED_SORT_FIELDS.includes(rawSortField) ? rawSortField : 'sortOrder';
    const sortOrder = (req.query._order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const orderBy: Record<string, string> = {};
    orderBy[sortField] = sortOrder;

    const [members, total] = await Promise.all([
      prisma.teamMember.findMany({ orderBy, skip: start, take: end - start }),
      prisma.teamMember.count(),
    ]);

    res.set('X-Total-Count', total.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamMemberById: RequestHandler = async (req, res) => {
  try {
    const member = await prisma.teamMember.findUnique({ where: { id: Number(req.params.id) } });
    if (!member) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTeamMember: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' }); return;
    }
    const data = createSchema.parse(req.body);
    const member = await prisma.teamMember.create({ data });
    res.status(201).json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error creating team member:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const updateTeamMember: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' }); return;
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid id' }); return;
    }
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ message: 'Not found' }); return; }

    const data = updateSchema.parse(req.body);
    const member = await prisma.teamMember.update({ where: { id }, data });
    res.status(200).json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error updating team member:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const deleteTeamMember: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' }); return;
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid id' }); return;
    }
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ message: 'Not found' }); return; }

    await prisma.teamMember.delete({ where: { id } });
    res.status(200).json({ message: 'Deleted', id });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadTeamMemberPhoto: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' }); return;
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid id' }); return;
    }
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) { res.status(404).json({ message: 'Not found' }); return; }

    if (!req.files?.photo) {
      res.status(400).json({ message: 'Файл не передан (поле: photo)' }); return;
    }
    const photo = req.files.photo as UploadedFile;

    if (!ALLOWED_MIME_TYPES.includes(photo.mimetype)) {
      res.status(400).json({ message: 'Недопустимый тип файла. Допустимы: JPG, PNG, WEBP' }); return;
    }
    const ext = path.extname(photo.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      res.status(400).json({ message: 'Недопустимое расширение файла' }); return;
    }

    const uploadDir = path.join(__dirname, '../../frontend/public/uploads/team-members', String(id));
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    if (member.photoUrl) {
      const oldFile = path.join(__dirname, '../../frontend/public', member.photoUrl);
      if (fs.existsSync(oldFile)) { try { fs.unlinkSync(oldFile); } catch { /* ignore */ } }
    }

    const fileName = 'photo' + ext;
    await photo.mv(path.join(uploadDir, fileName));

    const photoUrl = `/uploads/team-members/${id}/${fileName}`;
    const updated = await prisma.teamMember.update({ where: { id }, data: { photoUrl } });
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error uploading team member photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
