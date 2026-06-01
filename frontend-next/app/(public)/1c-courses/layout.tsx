import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Курсы и обучение 1С в Волжском — Инженер-центр',
  description:
    'Очные и онлайн-курсы 1С в Волжском: для бухгалтеров, руководителей, кладовщиков. Сертифицированные преподаватели, практические занятия, удостоверения о повышении квалификации.',
  keywords: ['курсы 1С Волжский', 'обучение 1С Волгоград', 'повышение квалификации 1С', '1С для бухгалтера'],
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
