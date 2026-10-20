import { RequestHandler } from 'express';
import { prisma } from '../utils/index.js';
import { invalidateSettingsCache } from '../email/SmtpProvider.js';

// Значения по умолчанию — возвращаются, если в БД нет записи
const DEFAULTS: Record<string, string> = {
  maintenance_mode: 'false',
  maintenance_phone: '',
  client_cabinet_enabled: 'true',
  indexing_enabled: 'false',
  // Email settings
  email_provider: 'smtp',
  smtp_host: 'smtp.timeweb.ru',
  smtp_port: '465',
  smtp_secure: 'true',
  smtp_user: '',
  smtp_pass: '',
  email_from_name: 'Инженер-центр',
  email_from_address: '',
};

// Публичный: получить все настройки (для middleware/robots.ts)
export const getPublicSettings: RequestHandler = async (req, res) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Админский: получить все настройки
export const getSettings: RequestHandler = async (req, res) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Админский: обновить (upsert) несколько настроек за раз
export const updateSettings: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: Only admins can change site settings' });
      return;
    }

    const updates = req.body as Record<string, string>;
    const allowedKeys = Object.keys(DEFAULTS);

    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.includes(key)) continue;
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    invalidateSettingsCache();

    // Возвращаем актуальное состояние
    const rows = await prisma.siteSetting.findMany();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const testEmail: RequestHandler = async (req, res) => {
  try {
    const { to } = req.body as { to?: string };

    // Determine recipient: use provided address or fall back to email_from_address setting
    let recipient = to?.trim();
    if (!recipient) {
      const fromRow = await prisma.siteSetting.findUnique({ where: { key: 'email_from_address' } });
      recipient = fromRow?.value || '';
    }

    if (!recipient) {
      res.status(400).json({ message: 'Не указан адрес получателя. Укажите email_from_address в настройках.' });
      return;
    }

    const { getEmailProvider } = await import('../email/EmailProviderFactory.js');
    const provider = await getEmailProvider();
    const result = await provider.send({
      to: recipient,
      subject: 'Тест - настройки почты работают',
      html: `
        <p>Если вы получили это письмо, настройки SMTP работают корректно.</p>
        <p>Время отправки: ${new Date().toLocaleString('ru-RU')}</p>
      `,
    });

    if (result.success) {
      res.status(200).json({ message: `Письмо отправлено на ${recipient}` });
    } else {
      res.status(500).json({ message: result.error || 'Ошибка отправки' });
    }
  } catch (error) {
    console.error('Error in testEmail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
