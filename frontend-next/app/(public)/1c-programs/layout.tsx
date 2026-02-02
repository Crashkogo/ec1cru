import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Программы 1С - ООО «Инженер-центр»',
  description:
    'Полный каталог программ 1С для автоматизации любых задач вашего бизнеса. Подберем оптимальное решение.',
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
