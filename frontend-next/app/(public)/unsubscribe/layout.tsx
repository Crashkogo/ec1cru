import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отписка от рассылки - ООО «Инженер-центр»',
  description: 'Отписка от email-рассылки ООО «Инженер-центр»',
  robots: 'noindex, nofollow',
};

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
