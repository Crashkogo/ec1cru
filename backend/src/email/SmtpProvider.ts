import nodemailer from 'nodemailer';
import { prisma } from '../utils/index.js';
import { IEmailProvider, SendOptions, SendResult } from './IEmailProvider.js';
import { EMAIL_USER, EMAIL_PASS } from '../config.js';

// Settings cache - refreshed every 60 seconds
let settingsCache: Record<string, string> | null = null;
let cacheTime = 0;

async function getEmailSettings(): Promise<Record<string, string>> {
  if (settingsCache && Date.now() - cacheTime < 60_000) return settingsCache;

  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ['smtp_host', 'smtp_port', 'smtp_secure', 'smtp_user', 'smtp_pass', 'email_from_name', 'email_from_address']
      }
    }
  });

  const settings: Record<string, string> = {
    smtp_host: 'smtp.timeweb.ru',
    smtp_port: '465',
    smtp_secure: 'true',
    smtp_user: EMAIL_USER,
    smtp_pass: EMAIL_PASS,
    email_from_name: 'Инженер-центр',
    email_from_address: EMAIL_USER,
  };

  for (const row of rows) {
    if (row.value) settings[row.key] = row.value;
  }

  settingsCache = settings;
  cacheTime = Date.now();
  return settings;
}

export function invalidateSettingsCache() {
  settingsCache = null;
}

export class SmtpProvider implements IEmailProvider {
  async send(options: SendOptions): Promise<SendResult> {
    try {
      const s = await getEmailSettings();

      const transporter = nodemailer.createTransport({
        host: s.smtp_host,
        port: parseInt(s.smtp_port),
        secure: s.smtp_secure === 'true',
        auth: {
          user: s.smtp_user,
          pass: s.smtp_pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${s.email_from_name}" <${s.email_from_address}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        headers: options.headers,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
