import { Metadata } from 'next';
import SupportPage from './SupportPage';

export const metadata: Metadata = {
  title: 'Поддержка и сопровождение - ООО «Инженер-центр»',
  description: 'Ознакомьтесь с тарифными планами, регламентом линии консультации и типовыми условиями сопровождения программ 1С.',
};

export default function Support() {
  return <SupportPage />;
}
