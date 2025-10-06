import express from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
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
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Отдаём статические файлы из папки фронтенда
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Access from network: http://<your-server-ip>:${PORT}`);
});