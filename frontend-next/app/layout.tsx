import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/components/ui/Notification';

export const metadata: Metadata = {
  title: 'Инженер-Центр - Услуги 1С в Краснодаре',
  description: 'Внедрение, сопровождение, обучение 1С. IT-аутсорсинг и готовые решения для бизнеса.',
  keywords: ['1С', 'Краснодар', 'внедрение 1С', 'сопровождение 1С', 'IT-аутсорсинг', 'обучение 1С'],
  openGraph: {
    title: 'Инженер-Центр - Услуги 1С в Краснодаре',
    description: 'Внедрение, сопровождение, обучение 1С. IT-аутсорсинг и готовые решения для бизнеса.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Инженер-Центр',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <NotificationProvider>
          {children}
          <Notification />
        </NotificationProvider>
      </body>
    </html>
  );
}
