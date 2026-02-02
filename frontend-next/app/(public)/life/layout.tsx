import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Жизнь компании - ООО «Инженер-центр»',
  description:
    'Новости и события из жизни компании «Инженер-центр» - наши достижения, мероприятия и интересные моменты',
  keywords: [
    'Жизнь компании',
    'Инженер-центр',
    'Корпоративные события',
    'Достижения компании',
  ],
};

export default function CompanyLifeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
