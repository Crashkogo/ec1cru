import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Курсы 1С - Обучение и повышение квалификации | ООО «Инженер-центр»',
  description:
    'Курсы и обучающие программы по 1С от ООО «Инженер-центр». Повышайте квалификацию вашей команды.',
  keywords: ['Курсы 1С', 'Обучение 1С', 'Повышение квалификации', '1С обучение'],
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
