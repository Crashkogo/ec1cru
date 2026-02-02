import { Metadata } from 'next';
import TechMaintenancePage from './TechMaintenancePage';

export const metadata: Metadata = {
  title: 'IT Аутсорсинг - Компьютерная помощь - ООО «Инженер-центр»',
  description: 'Наши услуги по техническому сопровождению и обслуживанию компьютерной техники, локальных сетей, серверного оборудования и оргтехники',
  keywords: ['it аутсорсинг', 'техническое обслуживание', 'компьютерная помощь', 'администрирование'].join(', '),
};

export default function TechMaintenance() {
  return <TechMaintenancePage />;
}
