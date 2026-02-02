import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Готовые решения 1С - ООО «Инженер-центр»',
  description:
    'Готовые решения 1С для автоматизации бизнеса. Обработки, отчёты, печатные формы для различных конфигураций.',
  keywords: [
    'Готовые решения 1С',
    'Обработки 1С',
    'Отчёты 1С',
    'Печатные формы 1С',
    '1С решения',
  ],
};

export default function ReadySolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
