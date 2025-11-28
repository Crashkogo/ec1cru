import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './ClientLayout';
import ClientDashboard from './ClientDashboard';
import ClientFinance from './ClientFinance';
import ClientSupport from './ClientSupport';
import ClientProfile from './ClientProfile';
import ClientContracts from './ClientContracts';

const ClientCabinet: React.FC = () => {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/contracts" element={<ClientContracts />} />
        <Route path="/finance" element={<ClientFinance />} />
        <Route path="/support" element={<ClientSupport />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default ClientCabinet;
