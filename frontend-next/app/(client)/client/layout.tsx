// frontend-next/app/(client)/client/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session'; // Предполагаем, что у нас будет такой файл для работы с сессией
import ClientArea from '@/components/client/ClientArea'; // Импортируем нашу новую оболочку

// Отключаем статическую генерацию для страниц, использующих cookies
export const dynamic = 'force-dynamic';

// Эта часть будет выполняться на сервере
export default async function ClientZoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(); // 1. Безопасно получаем сессию из cookie

  // 2. Если сессии нет или роль не 'CLIENT', перенаправляем на главную
  if (!session || session.role !== 'CLIENT') {
    redirect('/');
  }

  // 3. Данные о клиенте (включая менеджера) теперь безопасно получены на сервере
  const clientData = session.client;

  // 4. Отрисовываем единый клиентский компонент, который управляет всем UI,
  // передавая ему серверные данные и дочерние компоненты (page.tsx)
  return (
    <ClientArea clientData={clientData}>
      {children}
    </ClientArea>
  );
}
