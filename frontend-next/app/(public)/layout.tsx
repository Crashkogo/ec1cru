'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/LoginModal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Header setShowLogin={setShowLogin} />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer />
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
    </>
  );
}
