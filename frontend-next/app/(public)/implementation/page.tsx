import { Metadata } from 'next';
import ImplementationPage from './ImplementationPage';

export const metadata: Metadata = {
  title: 'Внедрение 1С в Волжском и Волгоградской области — Инженер-центр',
  description: 'Профессиональное внедрение 1С для производства, торговли, сферы услуг и ЖКХ. Полный цикл: обследование, настройка, обучение, сопровождение. Работаем по всей Волгоградской области.',
};

export default function Implementation() {
  return <ImplementationPage />;
}
