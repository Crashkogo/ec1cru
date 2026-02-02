# Миграция личного кабинета клиента на Next.js

## Дата завершения: 2 февраля 2026

## Обзор

Завершена полная миграция функционала личного кабинета клиента из React (frontend) в Next.js 13+ (frontend-next) с использованием современной архитектуры App Router, Server Components и Server Actions.

## Что было сделано

### 1. Система сессий и аутентификации

#### Созданные файлы:
- `lib/session.ts` - Полноценная система работы с JWT из HTTP-only cookies
  - Использует библиотеку `jose` для верификации JWT токенов
  - Читает токен из cookie `clientToken`
  - Проверяет роль пользователя (CLIENT)
  - Возвращает данные клиента из payload токена

#### Установленные зависимости:
```bash
npm install jose
```

#### Ключевые функции:
- `getSession()` - Получение сессии из cookie
- `getClientData()` - Получение только данных клиента
- `isAuthenticated()` - Проверка авторизации
- `clearSession()` - Очистка сессии при выходе

### 2. Server Actions для клиента

#### Создан файл: `actions/client-auth.ts`

Реализованные Server Actions:
- `loginClient(inn, password)` - Вход в систему
- `logoutClient()` - Выход из системы
- `getClientProfile()` - Получение профиля
- `changePassword(oldPassword, newPassword)` - Смена пароля
- `getInvoices()` - Получение списка счетов
- `getContracts()` - Получение списка договоров
- `getTickets()` - Получение списка заявок
- `createTicket(title, description, priority)` - Создание заявки
- `getDashboardStats()` - Получение статистики для dashboard

Все Server Actions:
- Безопасно работают с токенами (HTTP-only cookies)
- Используют axios для запросов к backend API
- Обрабатывают ошибки и возвращают понятные сообщения

### 3. Типы данных

#### Создан файл: `types/client.ts`

Определены TypeScript интерфейсы:
- `ClientData` - Данные клиента
- `SessionData` - Данные сессии
- `Invoice` - Счёт/инвойс
- `Contract` - Договор
- `Ticket` - Заявка в поддержку
- `TicketComment` - Комментарий к заявке
- `DashboardStats` - Статистика для главной страницы

### 4. Страницы личного кабинета

Все страницы находятся в директории `app/(client)/client/`:

#### 4.1. Главная страница (Dashboard)
**Файл:** `app/(client)/client/page.tsx`

- Server Component
- Загружает реальную статистику через `getDashboardStats()`
- Показывает данные о балансе, договорах, заявках
- Виджеты с информацией о менеджере
- Быстрые действия (запись на горячую линию, создание заявки и т.д.)

#### 4.2. Профиль
**Файл:** `app/(client)/client/profile/page.tsx`

- Server Component
- Отображает данные клиента из сессии
- Информация о компании (ИНН, название)
- Информация о менеджере (ФИО, контакты)
- Кнопка смены пароля с модальным окном

#### 4.3. Финансы
**Файл:** `app/(client)/client/finance/page.tsx`

- Server Component
- Загружает список счетов через `getInvoices()`
- Статистика: оплачено, к оплате, всего счетов
- Таблица со всеми счетами (номер, дата, сумма, статус)
- Статусы: оплачен, ожидает оплаты, просрочен
- Кнопки скачивания PDF для каждого счёта

#### 4.4. Договоры
**Файл:** `app/(client)/client/contracts/page.tsx`

- Server Component
- Загружает список договоров через `getContracts()`
- Статистика: всего, активные, завершенные
- Карточки договоров с полной информацией
- Статусы: активен, завершен, отменён
- Кнопки скачивания PDF и просмотра деталей

#### 4.5. Поддержка
**Файлы:**
- `app/(client)/client/support/page.tsx` - Server Component
- `components/client/SupportClient.tsx` - Client Component
- `components/client/CreateTicketModal.tsx` - Модальное окно

Функционал:
- Список всех заявок клиента
- Статистика: всего, новые, в работе, выполнены
- Статусы: новая, в работе, выполнена, отменена
- Приоритеты: низкий, средний, высокий
- Кнопка создания новой заявки
- Модальное окно с формой создания заявки
- Автообновление списка после создания

### 5. Компоненты

#### Созданные компоненты в `components/client/`:

1. **ClientArea.tsx**
   - Wrapper для всех страниц личного кабинета
   - Объединяет ClientHeader + ClientSidebar + children
   - Используется в layout.tsx

2. **ClientHeader.tsx**
   - Header с логотипом, кнопкой меню, уведомлениями
   - Аватар пользователя
   - Кнопка выхода

3. **ClientSidebar.tsx**
   - Боковое меню с навигацией
   - Мобильная версия с overlay
   - Активное выделение текущего пункта
   - Пункты: Главная, Договоры, Финансы, Поддержка, Профиль

4. **WelcomeHeader.tsx**
   - Компонент приветствия на главной странице
   - Показывает имя клиента
   - Кнопка обновления данных
   - Дата последнего обновления

5. **ChangePasswordButton.tsx**
   - Полнофункциональная форма смены пароля
   - Модальное окно с валидацией
   - Показ/скрытие паролей
   - Интеграция с Server Action `changePassword()`
   - Обработка ошибок и успешных операций

6. **CreateTicketModal.tsx**
   - Форма создания новой заявки
   - Поля: тема, описание, приоритет
   - Валидация на клиенте
   - Интеграция с Server Action `createTicket()`
   - Автозакрытие после успешного создания

7. **SupportClient.tsx**
   - Client Component для страницы поддержки
   - Управление состоянием модального окна
   - Список заявок с фильтрацией по статусам
   - Обновление списка через router.refresh()

### 6. Layout личного кабинета

**Файл:** `app/(client)/client/layout.tsx`

- Server Component
- Проверяет сессию через `getSession()`
- Redirect на главную если не авторизован
- Использует компонент ClientArea
- Защищает все вложенные страницы

### 7. Безопасность

#### HTTP-only cookies:
- Токен хранится в HTTP-only cookie `clientToken`
- JavaScript не имеет доступа к токену
- Защита от XSS атак

#### Server-side проверки:
- Все чтения данных происходят на сервере
- JWT верифицируется библиотекой `jose`
- Проверка роли пользователя

#### Backend интеграция:
- Backend уже использует HTTP-only cookies
- Cookie параметры: httpOnly, secure (в production), sameSite: 'strict'
- Срок жизни токена: 7 дней

### 8. Удалённые файлы и директории

Удалены дублирующиеся и неиспользуемые файлы:

- `app/client/` - Вся старая директория с localStorage подходом
- `components/client/ClientLayout.tsx` - Старая версия layout
- `components/auth/` - Неиспользуемая директория с заглушкой LoginModal

Оставлены только актуальные компоненты в `components/client/`:
- ClientArea.tsx
- ClientHeader.tsx
- ClientSidebar.tsx
- WelcomeHeader.tsx
- ChangePasswordButton.tsx
- CreateTicketModal.tsx
- SupportClient.tsx

## Архитектура

### Разделение Server/Client Components

**Server Components:**
- Страницы: page.tsx, profile/page.tsx, finance/page.tsx, contracts/page.tsx, support/page.tsx
- Layout: layout.tsx
- Выполняют Server Actions
- Работают с сессиями
- Не имеют интерактивности

**Client Components:**
- Модальные окна (CreateTicketModal, ChangePasswordButton)
- Компоненты с состоянием (SupportClient, WelcomeHeader)
- Интерактивные элементы (кнопки, формы)
- Используют 'use client' директиву

### Поток данных

```
User Request
  ↓
Layout (Server) - проверка сессии
  ↓
Page (Server) - загрузка данных через Server Actions
  ↓
Client Component (если нужен) - интерактивность
  ↓
Server Action - безопасные операции
  ↓
Backend API
```

## Backend endpoints

Для работы личного кабинета backend должен предоставлять следующие endpoints:

### Аутентификация:
- `POST /api/clients/login` - Вход (body: { inn, password })
- `POST /api/clients/logout` - Выход
- `GET /api/clients/profile` - Получение профиля

### Данные:
- `GET /api/clients/invoices` - Список счетов
- `GET /api/clients/contracts` - Список договоров
- `GET /api/clients/tickets` - Список заявок
- `POST /api/clients/tickets` - Создание заявки
- `GET /api/clients/dashboard` - Статистика для главной
- `POST /api/clients/change-password` - Смена пароля

Все endpoints требуют авторизации через JWT токен в header `Authorization: Bearer <token>` или через cookie `clientToken`.

## Переменные окружения

### Frontend-next (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=<такой же как на backend>
```

### Backend (.env):
```env
JWT_SECRET=<секретный ключ>
DATABASE_URL=<connection string>
```

## Оценка безопасности vs предложение Gemini

### Текущая реализация:
✅ HTTP-only cookies для токенов
✅ SameSite strict для защиты от CSRF
✅ Secure в production (только HTTPS)
✅ JWT подписаны и верифицируются
✅ Server-side валидация на каждом запросе
✅ Разделение Server/Client логики

### Предложение Gemini (iron-session):
- Дополнительное шифрование cookie (iron-session)
- Server Actions (уже реализовано)
- Vendor lock-in к Next.js

**Вывод:** Текущая реализация уже защищена от XSS и CSRF атак. Использование iron-session добавит шифрование cookie, но это не критично, так как JWT содержит только `{id, role, client}` - не чувствительные данные. Подписи JWT достаточно для защиты от подделки.

## Что осталось сделать на backend

### 1. Endpoints для личного кабинета
Backend должен реализовать следующие endpoints (если ещё не реализованы):

- `GET /api/clients/invoices` - Возвращает список счетов клиента
- `GET /api/clients/contracts` - Возвращает список договоров
- `GET /api/clients/tickets` - Возвращает список заявок
- `POST /api/clients/tickets` - Создаёт новую заявку
- `GET /api/clients/dashboard` - Возвращает статистику (balance, contractsCount, activeTicketsCount, pendingInvoicesCount)
- `POST /api/clients/change-password` - Изменяет пароль клиента

### 2. Модели базы данных
Необходимо создать в Prisma schema (если ещё нет):

```prisma
model Invoice {
  id          Int      @id @default(autoincrement())
  clientId    Int
  number      String
  date        DateTime
  amount      Float
  status      String   // paid, pending, overdue
  dueDate     DateTime?
  description String?
  client      Client   @relation(fields: [clientId], references: [id])
}

model Contract {
  id          Int      @id @default(autoincrement())
  clientId    Int
  number      String
  title       String
  startDate   DateTime
  endDate     DateTime?
  status      String   // active, completed, cancelled
  description String?
  amount      Float?
  pdfUrl      String?
  client      Client   @relation(fields: [clientId], references: [id])
}

model Ticket {
  id          Int      @id @default(autoincrement())
  clientId    Int
  title       String
  description String
  status      String   // new, in_progress, completed, cancelled
  priority    String   // low, medium, high
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  client      Client   @relation(fields: [clientId], references: [id])
  comments    TicketComment[]
}

model TicketComment {
  id         Int      @id @default(autoincrement())
  ticketId   Int
  authorId   Int
  authorName String
  text       String
  createdAt  DateTime @default(now())
  ticket     Ticket   @relation(fields: [ticketId], references: [id])
}
```

### 3. JWT Payload
Backend должен включать в JWT payload при входе клиента:

```json
{
  "id": 1,
  "role": "CLIENT",
  "client": {
    "id": 1,
    "inn": "7707083893",
    "name": "ПАО СБЕРБАНК",
    "email": "client@example.com",
    "phone": "+7 (999) 123-45-67",
    "managerId": 5,
    "manager": {
      "id": 5,
      "firstName": "Иван",
      "lastName": "Петров",
      "position": "Менеджер",
      "phone": "+7 (999) 111-22-33",
      "email": "manager@example.com"
    }
  }
}
```

## Тестирование

### Для тестирования работы:

1. Запустить backend сервер
2. Запустить frontend-next: `npm run dev`
3. Открыть http://localhost:3000
4. Войти через модальное окно входа (ИНН + пароль)
5. После успешного входа будет redirect на `/client`
6. Проверить все страницы:
   - Главная (dashboard)
   - Профиль (с кнопкой смены пароля)
   - Финансы (список счетов)
   - Договоры (список договоров)
   - Поддержка (список заявок + создание новой)

### Проверка безопасности:

1. Открыть DevTools → Application → Cookies
2. Проверить наличие cookie `clientToken` с флагом HttpOnly
3. Попробовать прочитать из консоли: `document.cookie` - токен не должен быть виден
4. Проверить redirect при отсутствии сессии:
   - Удалить cookie `clientToken`
   - Перезагрузить страницу `/client`
   - Должен быть redirect на `/`

## Рекомендации для дальнейшего развития

### 1. Refresh токены
Добавить систему refresh tokens для автоматического обновления истекших токенов без повторного входа.

### 2. Rate limiting
Ограничить количество попыток входа и запросов к API.

### 3. 2FA (двухфакторная аутентификация)
Для критичных операций (например, смена пароля).

### 4. Аудит лог
Логирование всех действий пользователя для безопасности.

### 5. Кэширование
Использовать Next.js ISR или кэш для часто запрашиваемых данных.

### 6. Оптимизация
- Добавить loading states для всех Server Actions
- Реализовать Suspense boundaries для async компонентов
- Добавить error boundaries

### 7. Мобильная версия
- Улучшить адаптивность
- Добавить touch gestures для мобильных устройств

## Заключение

Миграция личного кабинета клиента полностью завершена. Использована современная архитектура Next.js 13+ с максимальной безопасностью:

✅ HTTP-only cookies вместо localStorage
✅ Server Components для безопасной загрузки данных
✅ Server Actions для безопасных операций
✅ JWT верификация на сервере
✅ Правильное разделение Server/Client логики
✅ TypeScript типизация
✅ Удалён весь legacy код

Система готова к использованию и интеграции с backend API.
