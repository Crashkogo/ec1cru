import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мероприятия - ООО «Инженер-центр»',
  description:
    'Расписание мероприятий, вебинаров и семинаров по 1С. Бесплатные онлайн-трансляции для клиентов и партнеров.',
  keywords: [
    'Мероприятия 1С',
    'Вебинары 1С',
    'Семинары 1С',
    'Обучение 1С',
    'Онлайн-трансляции',
  ],
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
