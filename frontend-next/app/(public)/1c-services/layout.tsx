import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сервисы 1С - ООО «Инженер-центр»',
  description:
    'Полный каталог облачных сервисов 1С: ЭДО, отчетность, маркировка, кассы и многое другое для автоматизации вашего бизнеса.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
