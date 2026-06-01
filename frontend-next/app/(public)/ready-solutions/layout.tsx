import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Готовые решения и доработки 1С — Инженер-центр',
  description:
    'Готовые обработки, отчёты и печатные формы для 1С:Бухгалтерия, УТ, УНФ и других конфигураций. Разработка под задачи вашего бизнеса от специалистов Инженер-центра.',
  keywords: [
    'готовые решения 1С',
    'обработки 1С',
    'отчёты 1С',
    'печатные формы 1С',
    'доработка 1С',
  ],
};

export default function ReadySolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
