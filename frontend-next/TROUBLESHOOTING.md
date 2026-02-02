# Troubleshooting - Решение проблем

## Проблема с входом в админку

### Симптомы
- Не удается войти под логином/паролем
- Ошибка CORS в консоли браузера
- Ошибка "Network Error" или "Failed to fetch"

### Решение

#### 1. Проверьте, что backend запущен
```bash
cd backend
npm run dev
```

Backend должен быть запущен на порту 5000.

#### 2. Проверьте переменные окружения backend
Файл `backend/.env` должен содержать:
```env
FRONTEND_URL=http://localhost:3000
```

**ВАЖНО:** После изменения `.env` нужно перезапустить backend!

#### 3. Проверьте переменные окружения frontend
Файл `frontend-next/.env.local` должен содержать:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 4. Проверьте консоль браузера
Откройте DevTools (F12) → вкладка Console.
Вы должны увидеть логи:
```
Attempting login with: {username: "ваш_логин"}
Login successful, role: "ADMIN"
```

Если видите ошибку CORS:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/users/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

Это означает, что `FRONTEND_URL` в backend настроен неправильно.

#### 5. Проверьте, что backend отвечает
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"name":"your_username","password":"your_password"}'
```

Должен вернуть успешный ответ с ролью.

#### 6. Очистите кэш и cookies браузера
Иногда старые cookies могут мешать. Очистите их для localhost.

## Проблема "ssr: false is not allowed"

### Симптом
```
Error: `ssr: false` is not allowed with `next/dynamic` in Server Components
```

### Решение
Файл `app/admin/page.tsx` должен быть клиентским компонентом:
```tsx
'use client';  // <-- Эта строка обязательна!

import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  ssr: false,
  // ...
});
```

## Проблема с индексацией админки в поисковых системах

### Проверка
1. Файл `public/robots.txt` должен содержать:
```txt
Disallow: /admin
Disallow: /client
```

2. Layout админки (`app/admin/layout.tsx`) должен содержать:
```tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

## Полезные команды для отладки

### Проверить, запущен ли backend
```bash
curl http://localhost:5000/api/users/me
```

### Проверить переменные окружения Next.js
В коде добавьте:
```tsx
console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Просмотр логов backend
Backend логи выводятся в консоль при запуске `npm run dev`.

### Очистка кэша Next.js
```bash
cd frontend-next
rm -rf .next
npm run dev
```

## Если ничего не помогает

1. Перезапустите backend
2. Перезапустите frontend
3. Очистите кэш браузера
4. Проверьте, что порты не заняты другими приложениями
5. Проверьте логи консоли браузера на наличие ошибок
