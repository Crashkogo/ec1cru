// Скрипт для проверки подключения к базе данных
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('🔍 Проверяем подключение к базе данных...');

        // Проверяем подключение
        await prisma.$connect();
        console.log('✅ Подключение к базе данных установлено');

        // Проверяем количество записей в основных таблицах
        const userCount = await prisma.user.count();
        const newsCount = await prisma.news.count();
        const eventsCount = await prisma.events.count();
        const subscribersCount = await prisma.newsletterSubscriber.count();

        console.log('\n📊 Статистика базы данных:');
        console.log(`   Пользователи: ${userCount}`);
        console.log(`   Новости: ${newsCount}`);
        console.log(`   Мероприятия: ${eventsCount}`);
        console.log(`   Подписчики: ${subscribersCount}`);

        // Проверяем список пользователей
        console.log('\n👥 Список пользователей:');
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        users.forEach(user => {
            console.log(`   ID: ${user.id}, Имя: ${user.name}, Роль: ${user.role}, Создан: ${user.createdAt.toLocaleDateString()}`);
        });

        // Проверяем, есть ли админы
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' }
        });

        console.log(`\n🔑 Администраторов в системе: ${adminCount}`);

        if (adminCount === 0) {
            console.log('⚠️  Нет администраторов! Нужно создать админа.');
        }

    } catch (error) {
        console.error('❌ Ошибка подключения к базе данных:', error);
        console.log('\n🔧 Возможные решения:');
        console.log('1. Проверьте файл .env');
        console.log('2. Убедитесь, что база данных запущена');
        console.log('3. Проверьте DATABASE_URL');
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase(); 