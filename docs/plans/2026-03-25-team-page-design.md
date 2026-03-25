# Team Page Design

**Goal:** Создать страницу `/team` с карточками сотрудников по разделам, управляемую через админ-панель.

**Architecture:** Новая независимая Prisma-модель `TeamMember`, полностью отдельная от существующей `Employee` (которая используется для привязки менеджеров к клиентам). Backend CRUD + photo upload. React-Admin ресурс. Публичная Next.js server-component страница.

---

## База данных

Новая модель `TeamMember` в `backend/prisma/schema.prisma`:

```prisma
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

**5 значений section:**
- `MANAGERS` → "Менеджеры"
- `CONSULTATION` → "Сектор Линия консультаций"
- `ITS` → "Сектор ИТС"
- `IMPLEMENTATION` → "Сектор Внедрения"
- `TECH` → "Технический отдел"

Порядок отображения разделов фиксирован в коде фронтенда (именно в указанном порядке).

---

## Backend

**Файлы:**
- `backend/src/controllers/teamMemberController.ts` — новый
- `backend/src/routes/teamMemberRoutes.ts` — новый
- `backend/src/app.ts` — добавить `app.use('/api/team-members', teamMemberRoutes)`

**Эндпоинты:**

| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/api/team-members` | ❌ публичный | Список всех, поддержка `_start`/`_end`/`_sort`/`_order` для React-Admin |
| GET | `/api/team-members/:id` | ✅ ADMIN | Один сотрудник |
| POST | `/api/team-members` | ✅ ADMIN | Создать |
| PUT | `/api/team-members/:id` | ✅ ADMIN | Обновить |
| DELETE | `/api/team-members/:id` | ✅ ADMIN | Удалить |
| POST | `/api/team-members/:id/photo` | ✅ ADMIN | Загрузить/заменить фото |

**Валидация (Zod):**
```typescript
section: z.enum(['MANAGERS', 'CONSULTATION', 'ITS', 'IMPLEMENTATION', 'TECH'])
sortOrder: z.number().int().min(0).default(0)
position: z.string().min(1)
firstName/lastName: z.string().min(1)
```

**Фото:** сохраняется в `frontend/public/uploads/team-members/{id}/photo.jpg`, старое удаляется при замене. URL в БД: `/uploads/team-members/{id}/photo.jpg`.

---

## Админ-панель

**Файлы:**
- `frontend-next/app/admin/resources/team-members/TeamMembersList.tsx` — новый
- `frontend-next/app/admin/resources/team-members/TeamMembersCreate.tsx` — новый
- `frontend-next/app/admin/resources/team-members/TeamMembersEdit.tsx` — новый
- `frontend-next/app/admin/AdminDashboard.tsx` — регистрация ресурса

**Список:** таблица с колонками: фото-миниатюра, ФИО, Должность, Раздел, Порядок, Действия (Edit/Delete).

**Форма (Create и Edit):**
- `firstName` — TextInput, обязательное
- `lastName` — TextInput, обязательное
- `position` — TextInput, обязательное, свободный текст
- `section` — SelectInput с 5 вариантами на русском, обязательное
- `sortOrder` — NumberInput, по умолчанию 0, подсказка "0 = первый в разделе"
- Загрузка фото — в Edit: кнопка загрузки с превью текущего фото, POST `/:id/photo` сразу после выбора файла

**Стиль:** аналогичен остальным ресурсам (Card, MUI + Tailwind, существующая тема).

---

## Публичная страница `/team`

**Файл:** `frontend-next/app/(public)/team/page.tsx` — server component, `export const dynamic = 'force-dynamic'`

**SEO:**
```typescript
export const metadata: Metadata = {
  title: 'Наша команда — ООО «Инженер-центр»',
  description: 'Познакомьтесь с нашей командой специалистов...'
}
```

**Data fetching:** один запрос `fetch(BACKEND_URL + '/api/team-members?_start=0&_end=500')`, группировка по `section` в JS, сортировка по `sortOrder` внутри каждой группы.

**Порядок разделов:** `MANAGERS → CONSULTATION → ITS → IMPLEMENTATION → TECH`

**Структура JSX:**
```
<div container>
  <h1>Наша команда</h1>

  {разделы.filter(s => s.members.length > 0).map(section => (
    <section key={section.key}>
      <h2>{section.label}</h2>
      <div grid 3col/4col>
        {section.members.map(member => <MemberCard />)}
      </div>
    </section>
  ))}
</div>
```

**Карточка MemberCard:**
- Квадратное фото `object-cover` / градиентный плейсхолдер с инициалами
- Скруглённые углы карточки, тень `shadow-modern`
- Белый блок: **Имя Фамилия** (font-semibold), Должность (text-sm text-gray-500)
- Hover: лёгкий подъём (`hover:-translate-y-1 transition-transform`)

**Пустые разделы:** не отображаются (условный рендеринг).

---

## Стиль вёрстки

Цветовая схема — `modern-primary` синий, серые тоны `modern-gray-*`, белый фон карточек. Аналогично странице `/about` и другим публичным страницам.
