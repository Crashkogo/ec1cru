import { Metadata } from 'next';
import SupportPage from './SupportPage';

export const metadata: Metadata = {
  title: 'Сопровождение 1С в Волжском — тарифы и условия | Инженер-центр',
  description: 'Сопровождение программ 1С в Волжском и Волгоградской области. Тарифные планы, линия консультаций, обновления и техподдержка. Работаем быстро и на результат.',
};

export default function Support() {
  return <SupportPage />;
}
