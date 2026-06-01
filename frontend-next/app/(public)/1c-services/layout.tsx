import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сервисы 1С: ЭДО, отчётность, маркировка — Инженер-центр',
  description:
    'Подключение и настройка облачных сервисов 1С: электронный документооборот, сдача отчётности, маркировка товаров, онлайн-кассы. Помогаем выбрать и настроить под ваш бизнес.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
