import { Metadata } from 'next';
import ImplementationPage from './ImplementationPage';

export const metadata: Metadata = {
  title: 'Внедрение 1С - ООО «Инженер-центр»',
  description: 'Профессиональное внедрение программных продуктов 1С. Полный цикл работ от знакомства до сопровождения.',
};

export default function Implementation() {
  return <ImplementationPage />;
}
