import { getTickets } from '@/actions/client-auth';
import SupportClient from '@/components/client/SupportClient';

export default async function ClientSupportPage() {
  // Загружаем реальные данные через Server Action
  const tickets = await getTickets();

  return <SupportClient tickets={tickets} />;
}
