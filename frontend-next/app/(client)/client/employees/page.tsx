import { getClientEmployees } from '@/actions/client-auth';
import EmployeesClient from '@/components/client/EmployeesClient';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  const employees = await getClientEmployees();

  return <EmployeesClient employees={employees} />;
}
