// Скрипт для создания админа в экстренной ситуации
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('🔧 Создание админа...');

        const adminName = 'admin';
        const adminPassword = 'admin123'; // ВРЕМЕННЫЙ пароль!
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Проверяем, существует ли уже админ
        const existingAdmin = await prisma.user.findUnique({
            where: { name: adminName }
        });

        if (existingAdmin) {
            console.log('⚠️  Админ уже существует. Обновляем пароль...');
            await prisma.user.update({
                where: { name: adminName },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
        } else {
            console.log('➕ Создаем нового админа...');
            await prisma.user.create({
                data: {
                    name: adminName,
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
        }

        console.log('✅ Админ создан/обновлен!');
        console.log('📝 Данные для входа:');
        console.log(`   Логин: ${adminName}`);
        console.log(`   Пароль: ${adminPassword}`);
        console.log('⚠️  ОБЯЗАТЕЛЬНО смените пароль после входа!');

    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin(); 