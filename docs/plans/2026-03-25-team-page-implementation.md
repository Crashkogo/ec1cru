# Team Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Страница `/team` с карточками сотрудников по разделам, управляемая через React-Admin.

**Architecture:** Новая Prisma-модель `TeamMember`, полностью независимая от `Employee`. Backend CRUD + photo upload (`/api/team-members`). Три новых React-Admin компонента + регистрация ресурса. Публичная Next.js server component страница.

**Tech Stack:** Prisma 5, Express, TypeScript, React-Admin, Next.js 15 App Router, Tailwind CSS, Heroicons.

---

### Task 1: Prisma migration — добавить модель TeamMember

**Files:**
- Modify: `backend/prisma/schema.prisma`

**Step 1: Добавить модель в схему**

В конце файла `backend/prisma/schema.prisma` добавить после существующих моделей:

```prisma
// Модель для страницы команды — независима от Employee (менеджеры клиентов)
model TeamMember {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String
  position  String              // Должность: "Менеджер", "Специалист ИТС" и т.д.
  section   String              // MANAGERS | CONSULTATION | ITS | IMPLEMENTATION | TECH
  photoUrl  String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("team_members")
}
```

**Step 2: Запустить миграцию**

```bash
cd backend
npx prisma migrate dev --name add_team_member_table
```

Ожидаемый результат: создан файл миграции в `backend/prisma/migrations/`, Prisma Client перегенерирован.

**Step 3: Commit**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/
git commit -m "feat: add TeamMember prisma model"
```

---

### Task 2: Backend controller — `teamMemberController.ts`

**Files:**
- Create: `backend/src/controllers/teamMemberController.ts`

**Step 1: Создать контроллер**

```typescript
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
    const sortField = (req.query._sort  as string) || 'sortOrder';
    const sortOrder = (req.query._order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const orderBy: any = {};
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
```

**Step 2: Commit**

```bash
git add backend/src/controllers/teamMemberController.ts
git commit -m "feat: add teamMemberController"
```

---

### Task 3: Backend routes + регистрация в index.ts

**Files:**
- Create: `backend/src/routes/teamMemberRoutes.ts`
- Modify: `backend/src/index.ts`

**Step 1: Создать routes файл**

```typescript
import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberPhoto,
} from '../controllers/teamMemberController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET — публичный (для страницы /team на сайте)
router.get('/', getTeamMembers);
// Остальные — только для ADMIN
router.get('/:id',        authMiddleware, getTeamMemberById);
router.post('/',          authMiddleware, createTeamMember);
router.put('/:id',        authMiddleware, updateTeamMember);
router.delete('/:id',     authMiddleware, deleteTeamMember);
router.post('/:id/photo', authMiddleware, uploadTeamMemberPhoto);

export default router;
```

**Step 2: Зарегистрировать в `backend/src/index.ts`**

В файле `backend/src/index.ts` добавить:

После строки `import employeeRoutes from './routes/employeeRoutes.js';` добавить:
```typescript
import teamMemberRoutes from './routes/teamMemberRoutes.js';
```

После строки `app.use('/api/employees', employeeRoutes);` добавить:
```typescript
app.use('/api/team-members', teamMemberRoutes);
```

**Step 3: Commit**

```bash
git add backend/src/routes/teamMemberRoutes.ts backend/src/index.ts
git commit -m "feat: add teamMember routes and register in index.ts"
```

---

### Task 4: Admin — TeamMembersList.tsx

**Files:**
- Create: `frontend-next/app/admin/resources/team-members/TeamMembersList.tsx`

**Step 1: Создать компонент списка**

```tsx
'use client';

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  SearchInput,
  Pagination,
  FunctionField,
  useRecordContext,
  SelectInput,
} from 'react-admin';
import { Card, Box, Avatar } from '@mui/material';
import { PlusIcon } from '@heroicons/react/24/outline';

const sectionLabels: Record<string, string> = {
  MANAGERS:       'Менеджеры',
  CONSULTATION:   'Сектор Линия консультаций',
  ITS:            'Сектор ИТС',
  IMPLEMENTATION: 'Сектор Внедрения',
  TECH:           'Технический отдел',
};

const MemberNameField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const photoSrc = record.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${record.photoUrl}`
    : undefined;
  return (
    <div className="flex items-center gap-3">
      <Avatar src={photoSrc} sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: 16 }}>
        {!photoSrc && `${record.firstName?.charAt(0) || ''}${record.lastName?.charAt(0) || ''}`}
      </Avatar>
      <div>
        <p className="font-medium text-modern-gray-900">{record.firstName} {record.lastName}</p>
        <p className="text-sm text-modern-gray-500">{record.position}</p>
      </div>
    </div>
  );
};

const SectionField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{sectionLabels[record.section] || record.section}</span>;
};

const ActionButtons = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <div className="flex items-center space-x-1">
      <EditButton record={record} label="" className="!p-1 !min-w-0 !min-h-0" />
      <DeleteButton record={record} label="" className="!p-1 !min-w-0 !min-h-0" />
    </div>
  );
};

const sectionChoices = Object.entries(sectionLabels).map(([id, name]) => ({ id, name }));

const TeamFilters = [
  <SearchInput source="q" placeholder="Поиск по имени..." alwaysOn key="search"
    sx={{ marginLeft: '12px', '& .MuiInputBase-root': { borderRadius: '12px', border: '1px solid #e5e7eb' } }}
  />,
  <SelectInput source="section" label="Раздел" choices={sectionChoices} key="section" />,
];

const ListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
        startIcon={<PlusIcon className="h-4 w-4" />}
        label="Добавить сотрудника"
      />
    </div>
  </TopToolbar>
);

export const TeamMembersList: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-modern-gray-900">Команда сайта</h1>
      <p className="text-modern-gray-600 mt-1">Управление карточками сотрудников на странице /team</p>
    </div>
    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl overflow-hidden"
      sx={{
        '& .RaList-content': { padding: '24px' },
        '& .RaList-actions': { paddingBottom: '20px', paddingTop: '8px' },
        '& .MuiTableCell-head': { backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: '14px', padding: '16px' },
        '& .MuiTableCell-body': { borderBottom: '1px solid #f3f4f6', padding: '16px', fontSize: '14px' },
      }}
    >
      <List
        filters={TeamFilters}
        actions={<ListActions />}
        pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
        perPage={25}
        sort={{ field: 'section', order: 'ASC' }}
        title=""
        component="div"
      >
        <Datagrid bulkActionButtons={false}>
          <FunctionField label="Сотрудник" render={() => <MemberNameField />} />
          <FunctionField label="Раздел" render={() => <SectionField />} />
          <NumberField source="sortOrder" label="Порядок" />
          <DateField source="createdAt" label="Создан" locales="ru-RU" />
          <FunctionField label="Действия" render={() => <ActionButtons />} />
        </Datagrid>
      </List>
    </Card>
  </div>
);
```

**Step 2: Commit**

```bash
git add frontend-next/app/admin/resources/team-members/TeamMembersList.tsx
git commit -m "feat: add TeamMembersList admin component"
```

---

### Task 5: Admin — TeamMembersCreate.tsx

**Files:**
- Create: `frontend-next/app/admin/resources/team-members/TeamMembersCreate.tsx`

**Step 1: Создать форму создания**

```tsx
'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const sectionChoices = [
  { id: 'MANAGERS',       name: 'Менеджеры' },
  { id: 'CONSULTATION',   name: 'Сектор Линия консультаций' },
  { id: 'ITS',            name: 'Сектор ИТС' },
  { id: 'IMPLEMENTATION', name: 'Сектор Внедрения' },
  { id: 'TECH',           name: 'Технический отдел' },
];

const CreateActions = () => (
  <TopToolbar><ListButton /></TopToolbar>
);

const CreateToolbar = () => (
  <Toolbar><SaveButton /></Toolbar>
);

export const TeamMembersCreate: React.FC = () => (
  <Create title="Добавление сотрудника" actions={<CreateActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Новый сотрудник</Typography>
        <Typography variant="body2" color="text.secondary">
          После сохранения перейдите в редактирование для загрузки фотографии.
        </Typography>
      </Box>
      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput source="firstName" label="Имя"     validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="lastName"  label="Фамилия" validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="position"  label="Должность (свободный текст)" validate={[required()]} fullWidth helperText='Например: "Менеджер", "Специалист ИТС"' sx={{ mb: 2 }} />
        <SelectInput
          source="section"
          label="Раздел на странице /team"
          choices={sectionChoices}
          validate={[required()]}
          fullWidth
          sx={{ mb: 2 }}
        />
        <NumberInput
          source="sortOrder"
          label="Порядок в разделе"
          defaultValue={0}
          min={0}
          fullWidth
          helperText="0 = первый. Меньше число — выше позиция."
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Create>
);
```

**Step 2: Commit**

```bash
git add frontend-next/app/admin/resources/team-members/TeamMembersCreate.tsx
git commit -m "feat: add TeamMembersCreate admin component"
```

---

### Task 6: Admin — TeamMembersEdit.tsx

**Files:**
- Create: `frontend-next/app/admin/resources/team-members/TeamMembersEdit.tsx`

**Step 1: Создать форму редактирования с загрузкой фото**

```tsx
'use client';

import React, { useRef, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar,
  useRecordContext,
  useNotify,
  useRefresh,
} from 'react-admin';
import { Card, Typography, Box, Button, Avatar, CircularProgress } from '@mui/material';
import { CameraIcon } from '@heroicons/react/24/outline';

const sectionChoices = [
  { id: 'MANAGERS',       name: 'Менеджеры' },
  { id: 'CONSULTATION',   name: 'Сектор Линия консультаций' },
  { id: 'ITS',            name: 'Сектор ИТС' },
  { id: 'IMPLEMENTATION', name: 'Сектор Внедрения' },
  { id: 'TECH',           name: 'Технический отдел' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const TeamMemberPhotoUpload = () => {
  const record     = useRecordContext();
  const notify     = useNotify();
  const refresh    = useRefresh();
  const fileRef    = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  if (!record) return null;

  const photoSrc = record.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${record.photoUrl}`
    : undefined;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('photo', file);
      const res = await fetch(`${apiUrl}/api/team-members/${record.id}/photo`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка загрузки');
      }
      notify('Фото успешно загружено', { type: 'success' });
      refresh();
    } catch (err: any) {
      notify(err.message || 'Ошибка при загрузке фото', { type: 'error' });
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar src={photoSrc} sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}>
        {!photoSrc && `${record.firstName?.charAt(0) || ''}${record.lastName?.charAt(0) || ''}`}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {record.photoUrl ? 'Фотография загружена' : 'Фотография не загружена'}
        </Typography>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleChange} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <CameraIcon style={{ width: 16, height: 16 }} />}
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить фото'}
          </Button>
          <Typography variant="caption" color="text.secondary">JPG, PNG, WEBP · до 5 МБ</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EditActions = () => <TopToolbar><ListButton /></TopToolbar>;
const EditToolbar = () => <Toolbar><SaveButton /></Toolbar>;

const EditTitle = () => {
  const record = useRecordContext();
  return record ? `${record.firstName} ${record.lastName}` : 'Редактирование';
};

export const TeamMembersEdit: React.FC = () => (
  <Edit title={<EditTitle />} actions={<EditActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Редактирование сотрудника</Typography>
      </Box>
      <SimpleForm toolbar={<EditToolbar />}>
        <TeamMemberPhotoUpload />
        <TextInput source="id" label="ID" disabled fullWidth sx={{ mb: 2 }} />
        <TextInput source="firstName" label="Имя"     validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="lastName"  label="Фамилия" validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="position"  label="Должность" validate={[required()]} fullWidth helperText='Например: "Менеджер", "Специалист ИТС"' sx={{ mb: 2 }} />
        <SelectInput
          source="section"
          label="Раздел на странице /team"
          choices={sectionChoices}
          validate={[required()]}
          fullWidth
          sx={{ mb: 2 }}
        />
        <NumberInput
          source="sortOrder"
          label="Порядок в разделе"
          min={0}
          fullWidth
          helperText="0 = первый. Меньше число — выше позиция."
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Edit>
);
```

**Step 2: Commit**

```bash
git add frontend-next/app/admin/resources/team-members/TeamMembersEdit.tsx
git commit -m "feat: add TeamMembersEdit admin component with photo upload"
```

---

### Task 7: Регистрация ресурса в AdminDashboard и AdminMenu

**Files:**
- Modify: `frontend-next/app/admin/AdminDashboard.tsx`
- Modify: `frontend-next/components/AdminMenu.tsx`

**Step 1: Добавить импорты в AdminDashboard.tsx**

После строки `import { EmployeesList } ... from './resources/employees/EmployeesList';` и аналогичных добавить:

```typescript
import { TeamMembersList }   from './resources/team-members/TeamMembersList';
import { TeamMembersCreate } from './resources/team-members/TeamMembersCreate';
import { TeamMembersEdit }   from './resources/team-members/TeamMembersEdit';
```

**Step 2: Зарегистрировать Resource в AdminDashboard.tsx**

После строки `<Resource name="employees" list={EmployeesList} create={EmployeesCreate} edit={EmployeesEdit} />` добавить:

```tsx
<Resource name="team-members" list={TeamMembersList} create={TeamMembersCreate} edit={TeamMembersEdit} />
```

**Step 3: Добавить пункт меню в AdminMenu.tsx**

Прочитать файл `frontend-next/components/AdminMenu.tsx`. Найти блок с пунктом `Сотрудники` (путь `/admin#/employees`). После него добавить:

```typescript
{
  title: 'Команда сайта',
  path: '/admin#/team-members',
  icon: UsersIcon   // тот же импорт что уже есть
},
```

**Step 4: Commit**

```bash
git add frontend-next/app/admin/AdminDashboard.tsx frontend-next/components/AdminMenu.tsx
git commit -m "feat: register team-members resource in admin panel"
```

---

### Task 8: Публичная страница /team

**Files:**
- Create: `frontend-next/app/(public)/team/page.tsx`

**Step 1: Создать файл страницы**

```tsx
import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Наша команда — ООО «Инженер-центр»',
  description:
    'Познакомьтесь с командой специалистов ООО «Инженер-центр» — менеджерами, консультантами и техническими экспертами в области автоматизации на 1С.',
};

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  section: string;
  photoUrl: string | null;
  sortOrder: number;
}

const SECTION_ORDER = [
  'MANAGERS',
  'CONSULTATION',
  'ITS',
  'IMPLEMENTATION',
  'TECH',
] as const;

const SECTION_LABELS: Record<string, string> = {
  MANAGERS:       'Менеджеры',
  CONSULTATION:   'Сектор Линия консультаций',
  ITS:            'Сектор ИТС',
  IMPLEMENTATION: 'Сектор Внедрения',
  TECH:           'Технический отдел',
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  '';

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/team-members?_start=0&_end=500&_sort=sortOrder&_order=asc`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function MemberCard({ member }: { member: TeamMember }) {
  const photoSrc = member.photoUrl ? BACKEND_URL + member.photoUrl : null;
  const initials =
    (member.firstName.charAt(0) + member.lastName.charAt(0)).toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-modern overflow-hidden hover:-translate-y-1 transition-transform duration-300 border border-modern-gray-100">
      {/* Фото */}
      <div className="relative w-full aspect-square bg-modern-gray-100">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${member.firstName} ${member.lastName}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-modern-primary-400 to-modern-primary-700">
            <span className="text-white text-4xl font-bold select-none">{initials}</span>
          </div>
        )}
      </div>
      {/* Текст */}
      <div className="p-4 text-center">
        <p className="font-semibold text-modern-gray-900 text-base leading-tight">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-modern-gray-500 mt-1">{member.position}</p>
      </div>
    </div>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  // Группировка по разделам, сортировка уже применена бэкендом
  const grouped = SECTION_ORDER.reduce<Record<string, TeamMember[]>>((acc, key) => {
    acc[key] = members.filter((m) => m.section === key);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const hasAnyMembers = members.length > 0;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-modern-primary-700 mb-4">
            Наша команда
          </h1>
          <p className="text-lg text-modern-gray-600 max-w-2xl mx-auto">
            Профессионалы, которые помогают бизнесу работать эффективнее
          </p>
        </div>

        {!hasAnyMembers && (
          <p className="text-center text-modern-gray-500 py-20">
            Информация о команде скоро появится.
          </p>
        )}

        {/* Разделы */}
        {SECTION_ORDER.map((sectionKey) => {
          const sectionMembers = grouped[sectionKey];
          if (!sectionMembers || sectionMembers.length === 0) return null;
          return (
            <section key={sectionKey} className="mb-14">
              <h2 className="text-2xl font-semibold text-modern-gray-800 mb-6 pb-3 border-b border-modern-gray-200">
                {SECTION_LABELS[sectionKey]}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {sectionMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add "frontend-next/app/(public)/team/page.tsx"
git commit -m "feat: add public /team page with section grouping"
```

---

## Проверка после реализации

1. `GET /api/team-members` — возвращает пустой массив `[]` без авторизации
2. Войти в админку `/admin` → в меню должен появиться пункт "Команда сайта"
3. Создать тестового сотрудника, загрузить фото
4. Открыть `/team` — должна отображаться карточка в нужном разделе
5. Изменить `sortOrder` → обновить страницу — порядок изменился
6. Удалить тестового сотрудника → он пропадает со страницы
