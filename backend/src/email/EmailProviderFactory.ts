import { prisma } from '../utils/index.js';
import { IEmailProvider } from './IEmailProvider.js';
import { SmtpProvider } from './SmtpProvider.js';

export async function getEmailProvider(): Promise<IEmailProvider> {
  const row = await prisma.siteSetting.findUnique({ where: { key: 'email_provider' } });
  const provider = row?.value || 'smtp';

  switch (provider) {
    case 'smtp':
    default:
      return new SmtpProvider();
    // case 'sendpulse': return new SendPulseProvider();
  }
}
