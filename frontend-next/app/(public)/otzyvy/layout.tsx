import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отзывы клиентов - ООО «Инженер-центр»',
  description:
    'Отзывы наших клиентов о качестве услуг по внедрению и поддержке 1С, IT-аутсорсингу и автоматизации бизнеса.',
  keywords: [
    'Отзывы клиентов',
    'Отзывы о 1С',
    'Инженер-центр отзывы',
    'IT-аутсорсинг отзывы',
  ],
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
