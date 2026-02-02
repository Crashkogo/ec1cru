import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Акции - ООО «Инженер-центр»',
  description:
    'Актуальные акции и специальные предложения от ООО «Инженер-центр». Скидки на программы, услуги и обучение.',
  keywords: ['Акции 1С', 'Скидки', 'Специальные предложения', 'Акции Инженер-центр'],
};

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
