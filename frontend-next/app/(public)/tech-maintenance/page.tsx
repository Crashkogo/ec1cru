import { Metadata } from 'next';
import TechMaintenancePage from './TechMaintenancePage';

export const metadata: Metadata = {
  title: 'IT-аутсорсинг в Волжском — обслуживание компьютеров и сетей | Инженер-центр',
  description: 'IT-аутсорсинг для бизнеса в Волжском и Волгоградской области: обслуживание компьютеров, серверов, локальных сетей, оргтехники. Фиксированная стоимость, выезд специалиста.',
  keywords: ['IT-аутсорсинг Волжский', 'обслуживание компьютеров Волжский', 'техническое обслуживание', 'компьютерная помощь', 'администрирование сетей'],
};

export default function TechMaintenance() {
  return <TechMaintenancePage />;
}
