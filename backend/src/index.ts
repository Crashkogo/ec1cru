import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, FRONTEND_URL } from './config.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tariffPlanRoutes from './routes/tariffPlanRoutes.js';
import itsTariffPlanRoutes from './routes/itsTariffPlanRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настройка CORS
const corsOptions = {
  origin: FRONTEND_URL, // Укажи точный origin фронтенда (Vite работает на 5173)
  credentials: true, // Разрешаем отправку credentials (токенов)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Разрешённые методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешённые заголовки
  exposedHeaders: ['X-Total-Count'], // Разрешаем чтение заголовка X-Total-Count для React-Admin
};

app.use(cors(corsOptions));
app.use(cookieParser()); // БЕЗОПАСНОСТЬ: Парсинг HttpOnly cookies
app.use(express.json());

// БЕЗОПАСНОСТЬ: Security Headers для защиты от различных атак
app.use((req, res, next) => {
  // Защита от XSS атак (дополнительный уровень защиты)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Запрет на MIME-type sniffing (защита от неправильной интерпретации контента)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Защита от clickjacking атак (запрет встраивания в iframe)
  res.setHeader('X-Frame-Options', 'DENY');

  // CSP frame-ancestors (правильная директива вместо X-Frame-Options для современных браузеров)
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");

  // Строгая транспортная безопасность (HSTS) - только для HTTPS
  // Раскомментировать при использовании HTTPS в production:
  // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Запрет отправки Referer на внешние сайты
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Политика разрешений для браузерных API
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
});

// БЕЗОПАСНОСТЬ: Настройка загрузки файлов с ограничениями
app.use(fileUpload({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB максимальный размер файла
  },
  abortOnLimit: true, // Отклонять запросы с превышением лимита
  safeFileNames: true, // Удалять небезопасные символы из имён файлов
  preserveExtension: true // Сохранять расширение файла
}));

// Отдаём статические файлы из папки фронтенда
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', tariffPlanRoutes);
app.use('/api', itsTariffPlanRoutes);
app.use('/api', courseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Access from network: http://<your-server-ip>:${PORT}`);
});