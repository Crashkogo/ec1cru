// Скрипт для восстановления доступа к старому админу
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function fixAdminAccess() {
    try {
        console.log('🔧 Восстанавливаем доступ к админке...');

        // Находим админа "Денис"
        const denisAdmin = await prisma.user.findUnique({
            where: { name: 'Денис' }
        });

        if (denisAdmin) {
            console.log('👤 Найден админ "Денис"');

            // Устанавливаем простой пароль
            const newPassword = 'denis123';
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { name: 'Денис' },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });

            console.log('✅ Пароль для "Денис" обновлен!');
            console.log(`📝 Новые данные: Логин: Денис, Пароль: ${newPassword}`);
        }

        // Также обновим основного админа для надежности
        const mainAdmin = await prisma.user.findUnique({
            where: { name: 'admin' }
        });

        if (mainAdmin) {
            const adminPassword = 'admin123';
            const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

            await prisma.user.update({
                where: { name: 'admin' },
                data: {
                    password: hashedAdminPassword,
                    role: 'ADMIN'
                }
            });

            console.log('✅ Основной админ также обновлен!');
            console.log(`📝 Данные: Логин: admin, Пароль: ${adminPassword}`);
        }

        console.log('\n🎯 Попробуйте войти с любым из этих аккаунтов:');
        console.log('   1. Логин: Денис, Пароль: denis123');
        console.log('   2. Логин: admin, Пароль: admin123');

    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixAdminAccess(); 