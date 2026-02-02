// components/client/ClientArea.tsx
'use client';

import React, { useState } from 'react';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';

// Тип для данных клиента
interface ClientData {
  id: number;
  inn: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
  };
}

interface ClientAreaProps {
  clientData: ClientData;
  children: React.ReactNode;
}

const ClientArea: React.FC<ClientAreaProps> = ({ clientData, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <ClientHeader 
        clientData={clientData} 
        onMenuButtonClick={() => setIsSidebarOpen(true)} 
      />
      <ClientSidebar 
        clientData={clientData}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
};

export default ClientArea;
