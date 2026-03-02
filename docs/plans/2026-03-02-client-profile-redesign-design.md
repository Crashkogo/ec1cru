# Design: Client Profile Page Redesign

**Date:** 2026-03-02
**Status:** Approved

## Overview

Redesign the client cabinet profile page (`/client/profile`) to remove stub data, display both manager types with photos, and arrange the reduced content cleanly.

---

## Changes

### What's removed
- Stub email field ("Email (заглушка)" → `info@example.com`)
- Stub phone field ("Телефон (заглушка)" → `+7 (XXX) XXX-XX-XX`)
- Non-functional "Позвонить" and "Написать" buttons on the manager card
- "Последнее изменение: никогда" stub text in the security section

### What's fixed
- Both `manager` (Manager 1С) and `managerTech` (Менеджер технического отдела) are displayed — currently only `manager` is shown
- Manager photos are displayed using the same pattern as the dashboard (`BACKEND_URL + photoUrl`, fallback to gradient initials circle)

---

## Layout (Option A — approved)

```
┌────────────────────────┐  ┌────────────────────────┐
│  Организация           │  │  Безопасность          │
│                        │  │                        │
│  [🏢] ООО Компания    │  │  Пароль                │
│  ИНН: 123456789        │  │  [Изменить пароль →]   │
│                        │  │                        │
└────────────────────────┘  └────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Ваши менеджеры                                     │
│                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │ [фото] Иван И.      │  │ [фото] Пётр П.      │  │
│  │ Менеджер по 1С      │  │ Менеджер технич. отд│  │
│  └─────────────────────┘  └─────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Top row: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Bottom card: full-width, managers displayed with `grid grid-cols-1 sm:grid-cols-2 gap-4` inside
- If no managers assigned: amber warning banner (same pattern as dashboard)

---

## Manager Card (reused pattern from dashboard)

```tsx
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ...

// For each manager:
const photoSrc = manager.photoUrl ? `${BACKEND_URL}${manager.photoUrl}` : null;

// Photo or initials fallback:
{photoSrc ? (
  <Image src={photoSrc} alt="..." width={64} height={64} className="w-16 h-16 rounded-full object-cover shadow" />
) : (
  <div className="w-16 h-16 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
    {manager.firstName?.charAt(0) || 'М'}
  </div>
)}
<p className="font-bold text-modern-gray-900">{manager.firstName} {manager.lastName}</p>
<p className="text-sm text-modern-gray-500">{title}</p>  // "Менеджер по 1С" or "Менеджер технического отдела"
```

---

## File Changes

**Only one file modified:**
- `frontend-next/app/(client)/client/profile/page.tsx` — complete rewrite

No backend changes. No new components (reuse existing `ChangePasswordButton`).

---

## Data Available

From `/api/clients/me` (via `getSession()`):
- `clientData.name` — org name
- `clientData.inn` — INN
- `clientData.manager` — Manager 1С (optional): `{ firstName, lastName, photoUrl, department }`
- `clientData.managerTech` — Tech manager (optional): same shape
