# CLAUDE.md

Этот файл содержит руководство для Claude Code (claude.ai/code) при работе с кодом в данном репозитории.

## Языковые предпочтения

**ВАЖНО: Всегда отвечайте на русском языке при работе с этим репозиторием.**

## Рабочий процесс разработки

**ВАЖНО: НИКОГДА не проверяйте, запущены ли серверы backend или frontend, и НИКОГДА не пытайтесь запускать, перезапускать или собирать их.**

- Разработчик управляет всеми процессами серверов вручную в отдельных терминалах
- Backend использует `tsx watch` для автоматической горячей перезагрузки при изменении файлов
- Frontend использует dev-сервер Vite с автоматической горячей перезагрузкой
- Разработчик вручную перезапустит серверы при необходимости
- НЕ запускайте команды `npm run build`, `npm run dev` или любые другие команды управления серверами
- Сосредоточьтесь только на изменениях кода - разработчик управляет runtime-окружением

## Внешняя документация

**ВАЖНО: Всегда используйте MCP-сервер Context7 для получения актуальной документации библиотек.**

- При работе с внешними библиотеками (React, Prisma, TinyMCE и т.д.) используйте инструменты Context7 MCP
- Доступные инструменты: `mcp__context7__resolve-library-id` и `mcp__context7__get-library-docs`
- Это гарантирует использование последних API и лучших практик
- Пример: Для документации React сначала получите library ID, затем загрузите документацию

## Обзор проекта

Full-stack веб-приложение для компании, занимающейся консалтингом 1С, с публичным сайтом и админ-панелью. Построено на React + TypeScript фронтенде и Node.js + Express + Prisma бэкенде.

## Команды

### Разработка Backend
```bash
cd backend
npm install          # Установка зависимостей
npm run dev          # Dev-сервер с hot reload (tsx watch)
npm run build        # Компиляция TypeScript в dist/
npm run start        # Запуск production-сборки
npx prisma migrate dev  # Запуск миграций базы данных
npx prisma studio    # Открыть GUI Prisma Studio
```

### Разработка Frontend
```bash
cd frontend
npm install          # Установка зависимостей
npm run dev          # Запуск Vite dev-сервера
npm run build        # Сборка для production
npm run preview      # Просмотр production-сборки
npm run test         # Запуск тестов Vitest
npm run test:ui      # Запуск тестов с UI
npm run test:coverage # Генерация отчета о покрытии
npm run lint         # Запуск ESLint
```

### Миграции базы данных
При изменении схемы Prisma:
1. Обновите `backend/prisma/schema.prisma`
2. Выполните `npx prisma migrate dev --name описание_изменения`
3. Prisma Client автоматически перегенерируется

### Запланированные задачи
Скрипт обработки рассылок должен запускаться через cron:
```bash
node backend/dist/scripts/processScheduledNewsletters.js
```

## Архитектура

### Структура Backend

**Трёхслойная архитектура:**
- **Routes** (`backend/src/routes/`) - Определение HTTP-эндпоинтов, применение middleware
- **Controllers** (`backend/src/controllers/`) - Бизнес-логика, валидация, Prisma-запросы
- **Services** (`backend/src/services/`) - Сложные операции (очередь email с rate limiting)

**Основные маршруты:**
- `userRoutes.ts` - Аутентификация и управление пользователями
- `postRoutes.ts` - Унифицированные маршруты для всего контента (новости, события, акции, решения)
- `courseRoutes.ts` - Управление курсами 1С
- `employeeRoutes.ts` - Управление сотрудниками (менеджерами)
- `clientRoutes.ts` - Управление клиентами и личным кабинетом
- `tariffPlanRoutes.ts` - Тарифные планы IT-аутсорсинга
- `itsTariffPlanRoutes.ts` - Тарифные планы 1С:ИТС

**Аутентификация:**
- JWT-токены в заголовке `Authorization: Bearer <token>`
- Middleware: `backend/src/middleware/authMiddleware.ts`
- Payload токена: `{ id: number, role: string }`, срок действия 30 дней
- Роли: ADMIN, MODERATOR, EVENTORG, CLINE, ITS, DEVDEP

**Модели базы данных (Prisma):**
- `User` - Пользователи админ-панели с ролевым доступом
- `News` - Новости с SEO-метаданными
- `CompanyLife` - Публикации "Жизнь компании"
- `Events` - События с системой регистрации (one-to-many с EventsRegistration)
- `Promotions` - Маркетинговые акции с временными рамками
- `ReadySolution` - Каталог готовых решений 1С (many-to-many с Program через SolutionProgram)
- `Program` - Программы 1С
- `NewsletterTemplate` - HTML-шаблоны email-рассылок
- `NewsletterSubscriber` - Подписчики на рассылку с токенами отписки
- `NewsletterCampaign` - Email-кампании с отслеживанием
- `TariffPlan` - Тарифные планы IT-аутсорсинга
- `ItsTariffPlan` - Тарифные планы 1С:ИТС (сопровождение 1С)
- `Course` - Курсы обучения 1С
- `Testimonial` - Отзывы клиентов
- `Employee` - Сотрудники компании (менеджеры)
- `Client` - Клиенты с доступом к личному кабинету

**Система загрузки файлов:**
Двухэтапный процесс для обработки изображений, загруженных до создания сущности:
1. Загрузка в `/uploads/{entity}/temp/`
2. Перемещение в `/uploads/{entity}/{slug}/` после создания сущности с известным slug
3. Имена файлов транслитерируются (кириллица → латиница) с временными метками

### Структура Frontend

**Маршрутизация:**
- Публичные маршруты обёрнуты в компонент `<Layout>` с header/footer
- Админ-маршруты по адресу `/admin/*` обрабатываются React-Admin (внутри используется hash-based routing)
- Личный кабинет клиента по адресу `/client/*` (защищён аутентификацией клиента)
- Страницы деталей используют ленивую загрузку с React.lazy() для code splitting

**Интеграция React-Admin:**
- Основная конфигурация: `frontend/src/pages/admin/Dashboard.tsx`
- Кастомный data provider: `frontend/src/admin/dataProvider.ts` отображает методы React-Admin на backend API
- Auth provider: `frontend/src/admin/authProvider.ts` управляет хранением JWT и проверкой
- Каждый ресурс следует паттерну: компоненты List, Create, Edit
- Интеграция TinyMCE для редактирования rich text контента

**Управление состоянием:**
- React Query (TanStack Query) для серверного состояния на публичных страницах
- Встроенное управление состоянием React-Admin для админ-панели

**Личный кабинет клиента:**
- Отдельная система аутентификации для клиентов (отличная от админов)
- Вход по ИНН и паролю
- Разделы: Профиль, Финансы, Поддержка, Договоры
- Layout с боковым меню и шапкой

### Ключевые паттерны

**URL на основе slug:**
- Весь публичный контент использует slug для SEO: `/news/obnovlenie-1c-buhgalteriya`
- Slug автоматически генерируется из заголовка с помощью библиотеки `slugify`
- Админ-панель использует числовые ID внутри

**Many-to-Many: ReadySolution ↔ Program**
- Join-таблица: `SolutionProgram` с составным ключом [solutionId, programId]
- При создании/обновлении решения получаем массив `programIds[]`
- Используем вложенные создания Prisma для заполнения join-таблицы
- UI админки имеет мультиселект для программ

**Поток регистрации на события:**
1. Пользователь отправляет форму с проверкой reCAPTCHA v3 (score ≥ 0.5)
2. Создаётся запись EventsRegistration (cascade delete при удалении события)
3. Отправляется email-подтверждение с деталями события и ссылкой на трансляцию
4. Админ просматривает регистрации в React-Admin

**Система рассылок:**
- Кампании на основе шаблонов с двумя типами аудитории: SUBSCRIBERS или EVENT_GUESTS
- Очередь email в `newsletterService.ts` с rate limiting (30/мин, 1000/час)
- Пакетная обработка: 5 email за раз
- JWT-токены отписки в футерах писем
- Запланированные кампании обрабатываются cron-скриптом

**Система тарифов:**
- IT-аутсорсинг: JSON-структура с колонками и строками таблицы
- 1С:ИТС: JSON-массив строк с цветом и выделением
- Управление через админ-панель с порядком отображения

**Личный кабинет клиента:**
- Аутентификация по ИНН + пароль
- JWT-токен хранится в localStorage (ключ `clientToken`)
- Привязка клиента к менеджеру (модель Employee)
- Защищённые маршруты через PrivateRoute

## Важные соглашения

**TypeScript:**
- ES Modules (`"type": "module"` в package.json)
- Включён strict mode
- Используйте `import type` для импорта только типов

**База данных:**
- Prisma обрабатывает все операции с БД
- Нет сырых SQL-запросов
- Используйте `include` для связей, избегайте N+1 запросов
- Cascade delete настроены для зависимых записей (например, EventsRegistration при удалении Event)

**Дизайн API:**
- Публичные маршруты: GET-запросы, авторизация не требуется
- Админ-маршруты: POST/PUT/PATCH/DELETE с `authMiddleware`
- Пагинация: параметры запроса `_start` и `_end`, возврат заголовка `X-Total-Count`
- Формат ответа: JSON с согласованной обработкой ошибок

**Конфигурация окружения:**
- Backend: Загрузка из `.env` через `dotenv` в `backend/src/config.ts`
- Frontend: Переменные окружения Vite с префиксом `VITE_`
- Обязательные переменные: DATABASE_URL, JWT_SECRET, CAPTCHA_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL, UNSUBSCRIBE_SECRET, EMAIL_CALL_IN, EMAIL_CALL_OUT, EMAIL_PASS_OUT

**Загрузка файлов:**
- Используется middleware `express-fileupload`
- Сохранение в `frontend/public/uploads/{entity}/{slug}/` для постоянного хранения
- Временные загрузки в `frontend/public/uploads/{entity}/temp/`
- Статическая раздача настроена в Express: `app.use('/uploads', express.static(...))`
- Ограничение размера: 5MB
- Безопасные имена файлов с сохранением расширений

**Отправка email:**
- Используется `nodemailer`, настроенный в `backend/src/utils/index.ts`
- Все письма включают ссылку отписки (кроме транзакционных)
- Соблюдаются лимиты: 30/мин, 1000/час
- Система очередей предотвращает перегрузку SMTP-сервера
- Два email-аккаунта: для входящих заявок (EMAIL_CALL_IN) и исходящих писем (EMAIL_CALL_OUT)

**Редактирование контента:**
- TinyMCE для rich text (хранит HTML в базе данных)
- Загрузка изображений через TinyMCE идёт через эндпоинт `/api/posts/upload-image`
- Санитизация контента: полагается на встроенную XSS-защиту TinyMCE
- Дополнительная санитизация с помощью библиотеки `sanitize-html` в некоторых контроллерах

## Примечания по безопасности

- Пароли хешируются с помощью bcrypt (10 раундов соли)
- SQL-инъекции защищены параметризованными запросами Prisma
- XSS: React автоматически экранирует, но сохранённый HTML рендерится через `dangerouslySetInnerHTML`
- reCAPTCHA v3 для форм регистрации на события
- CORS настроен на разрешение только origin из `FRONTEND_URL`
- Загрузка файлов: имена файлов санитизируются для предотвращения path traversal
- Security headers: X-XSS-Protection, X-Content-Type-Options, X-Frame-Options, CSP frame-ancestors, Referrer-Policy, Permissions-Policy
- Ограничение размера загружаемых файлов: 5MB
- Раздельная аутентификация для админов и клиентов

## Тестирование

Фронтенд-тесты используют Vitest + React Testing Library. Запуск тестов из директории `frontend/`:
- `npm run test` - Запустить все тесты
- `npm run test:ui` - Интерактивный UI тестов
- `npm run test:coverage` - Сгенерировать отчёт о покрытии

Backend-тесты в настоящее время не настроены.

## Соображения по развёртыванию

**База данных:**
- Требуется PostgreSQL (локальная или хостинговая)
- Запустите миграции перед развёртыванием: `npx prisma migrate deploy`
- Сгенерируйте Prisma Client в сборке: `npx prisma generate`

**Запланированные задачи:**
- Настройте cron для обработчика рассылок: `*/5 * * * * node backend/dist/scripts/processScheduledNewsletters.js`

**SMTP:**
- Настройте EMAIL_USER, EMAIL_PASS, EMAIL_CALL_OUT, EMAIL_PASS_OUT для Nodemailer
- Текущая настройка использует SMTP Timeweb (smtp.timeweb.ru:465)

**Статические файлы:**
- Backend раздаёт загрузки из `frontend/public/uploads`
- Убедитесь, что директории загрузок существуют и доступны для записи
- Рассмотрите использование CDN для раздачи изображений в production

## Логирование

Backend использует Winston для логирования:
- Логи пишутся в консоль и в файл `backend/logs/combined.log`
- Уровни логирования: error, warn, info, http, debug
- Логи ошибок отдельно в `backend/logs/error.log`
- Используйте импортированный logger из `backend/src/utils/logger.ts`
