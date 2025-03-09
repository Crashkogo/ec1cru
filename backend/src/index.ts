import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});