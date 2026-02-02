import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Новости - ООО «Инженер-центр»',
  description:
    'Актуальные новости 1С, изменения в программах, обновления законодательства и другая полезная информация.',
  keywords: ['Новости 1С', 'Обновления 1С', 'Законодательство', 'Программы 1С'],
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
