# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**IMPORTANT: Always respond in Russian language (Русский язык) when working in this repository.**

## Development Workflow

**IMPORTANT: NEVER check if backend or frontend servers are running, and NEVER attempt to start, restart, or build them.**

- The developer controls all server processes manually in separate terminals
- Backend uses `tsx watch` for automatic hot-reload on file changes
- Frontend uses Vite dev server with automatic hot-reload
- The developer will manually restart servers if needed
- DO NOT run `npm run build`, `npm run dev`, or any server management commands
- Focus only on code changes - the developer handles the runtime environment

## External Documentation

**IMPORTANT: Always use MCP server Context7 for fetching up-to-date library documentation.**

- When working with external libraries (React, Prisma, TinyMCE, etc.), use Context7 MCP tools
- Available tools: `mcp__context7__resolve-library-id` and `mcp__context7__get-library-docs`
- This ensures you're using the latest API and best practices
- Example: For React documentation, resolve library ID first, then fetch docs

## Project Overview

Full-stack web application for a 1C consulting company with a public website and admin panel. Built with React + TypeScript frontend and Node.js + Express + Prisma backend.

## Commands

### Backend Development
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Development server with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm run start        # Run production build
npx prisma migrate dev  # Run database migrations
npx prisma studio    # Open Prisma Studio GUI
```

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

### Database Migrations
When modifying the Prisma schema:
1. Update `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Prisma Client auto-regenerates

### Scheduled Jobs
The newsletter processor script should run via cron:
```bash
node backend/dist/scripts/processScheduledNewsletters.js
```

## Architecture

### Backend Structure

**Three-Layer Architecture:**
- **Routes** (`backend/src/routes/`) - Define HTTP endpoints, apply middleware
- **Controllers** (`backend/src/controllers/`) - Business logic, validation, Prisma queries
- **Services** (`backend/src/services/`) - Complex operations (email queue with rate limiting)

**Key Routes:**
- `userRoutes.ts` - Authentication and user management
- `postRoutes.ts` - Unified routes for all content (news, events, promotions, solutions)

**Authentication:**
- JWT tokens in `Authorization: Bearer <token>` header
- Middleware: `backend/src/middleware/authMiddleware.ts`
- Token payload: `{ id: number, role: string }`, 30-day expiry
- Roles: ADMIN, MODERATOR, EVENTORG, CLINE, ITS, DEVDEP

**Database Models (Prisma):**
- `User` - Admin users with role-based access
- `News` - News articles with SEO metadata
- `Events` - Events with registration system (one-to-many with EventsRegistration)
- `Promotions` - Marketing promotions with time bounds
- `ReadySolution` - 1C solutions catalog (many-to-many with Program via SolutionProgram)
- `Program` - 1C software programs
- `NewsletterTemplate` - HTML email templates
- `NewsletterSubscriber` - Email subscribers with unsubscribe tokens
- `NewsletterCampaign` - Email campaigns with tracking

**File Upload System:**
Two-stage process to handle images uploaded before entity creation:
1. Upload to `/uploads/{entity}/temp/`
2. Move to `/uploads/{entity}/{slug}/` after entity creation with known slug
3. Filenames are transliterated (Cyrillic → Latin) with timestamps

### Frontend Structure

**Routing:**
- Public routes wrapped in `<Layout>` component with header/footer
- Admin routes at `/admin/*` handled by React-Admin (hash-based internally)
- Detail pages use lazy loading with React.lazy() for code splitting

**React-Admin Integration:**
- Main config: `frontend/src/pages/admin/Dashboard.tsx`
- Custom data provider: `frontend/src/admin/dataProvider.ts` maps React-Admin methods to backend API
- Auth provider: `frontend/src/admin/authProvider.ts` handles JWT storage and verification
- Each resource follows pattern: List, Create, Edit components
- TinyMCE integration for rich text content editing

**State Management:**
- React Query (TanStack Query) for server state on public pages
- React-Admin built-in state management for admin panel

### Key Patterns

**Slug-Based URLs:**
- All public content uses slugs for SEO: `/news/obnovlenie-1c-buhgalteriya`
- Slugs auto-generated from title using `slugify` library
- Admin panel uses numeric IDs internally

**Many-to-Many: ReadySolution ↔ Program**
- Join table: `SolutionProgram` with composite key [solutionId, programId]
- When creating/updating solution, receive `programIds[]` array
- Use Prisma nested creates to populate join table
- Admin UI has multi-select for programs

**Event Registration Flow:**
1. User submits form with reCAPTCHA v3 verification (score ≥ 0.5)
2. Create EventsRegistration record (cascade delete with event)
3. Send confirmation email with event details and broadcast link
4. Admin views registrations in React-Admin

**Newsletter System:**
- Template-based campaigns with two audience types: SUBSCRIBERS or EVENT_GUESTS
- Email queue in `newsletterService.ts` with rate limiting (30/min, 1000/hr)
- Batch processing: 5 emails at a time
- JWT-based unsubscribe tokens in email footers
- Scheduled campaigns processed by cron job script

## Important Conventions

**TypeScript:**
- ES Modules (`"type": "module"` in package.json)
- Strict mode enabled
- Use `import type` for type-only imports

**Database:**
- Prisma handles all database operations
- No raw SQL queries
- Use `include` for relations, avoid N+1 queries
- Cascade deletes configured for dependent records (e.g., EventsRegistration when Event deleted)

**API Design:**
- Public routes: GET requests, no auth required
- Admin routes: POST/PUT/PATCH/DELETE with `authMiddleware`
- Pagination: `_start` and `_end` query params, return `X-Total-Count` header
- Response format: JSON with consistent error handling

**Environment Configuration:**
- Backend: Load from `.env` via `dotenv` in `backend/src/config.ts`
- Frontend: Vite env vars prefixed with `VITE_`
- Required vars: DATABASE_URL, JWT_SECRET, CAPTCHA_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL

**File Uploads:**
- Use `express-fileupload` middleware
- Save to `frontend/public/uploads/{entity}/{slug}/` for permanent storage
- Temp uploads go to `frontend/public/uploads/{entity}/temp/`
- Static serving configured in Express: `app.use('/uploads', express.static(...))`

**Email Sending:**
- Use `nodemailer` configured in `backend/src/utils/index.ts`
- All emails include unsubscribe link (except transactional)
- Respect rate limits: 30/min, 1000/hr
- Queue system prevents overwhelming SMTP server

**Content Editing:**
- TinyMCE for rich text (stores HTML in database)
- Image uploads via TinyMCE go through `/api/posts/upload-image` endpoint
- Content sanitization: Relies on TinyMCE's built-in XSS protection

## Security Notes

- Passwords hashed with bcrypt (10 salt rounds)
- SQL injection protected by Prisma parameterized queries
- XSS: React auto-escapes, but stored HTML rendered with `dangerouslySetInnerHTML`
- reCAPTCHA v3 for event registration forms
- CORS configured to allow only `FRONTEND_URL` origin
- File upload: Filenames sanitized to prevent path traversal

## Testing

Frontend tests use Vitest + React Testing Library. Run tests from `frontend/` directory:
- `npm run test` - Run all tests
- `npm run test:ui` - Interactive test UI
- `npm run test:coverage` - Generate coverage report

Currently no backend tests configured.

## Deployment Considerations

**Database:**
- PostgreSQL required (local or hosted)
- Run migrations before deploying: `npx prisma migrate deploy`
- Generate Prisma Client in build: `npx prisma generate`

**Scheduled Jobs:**
- Set up cron for newsletter processor: `*/5 * * * * node backend/dist/scripts/processScheduledNewsletters.js`

**SMTP:**
- Configure EMAIL_USER and EMAIL_PASS for Nodemailer
- Current setup uses Timeweb SMTP (smtp.timeweb.ru:465)

**Static Files:**
- Backend serves uploads from `frontend/public/uploads`
- Ensure upload directories exist and are writable
- Consider CDN for production image serving
