import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Программы 1С — каталог и лицензии | Инженер-центр, Волжский',
  description:
    'Полный каталог программ 1С: Бухгалтерия, УТ, УНФ, Зарплата, ЭРП и другие. Продажа лицензий, настройка и внедрение в Волжском и Волгоградской области.',
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
