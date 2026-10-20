'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`${API_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus(data.message === 'Already confirmed' ? 'already' : 'success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      background: '#f8fafc',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h1 style={{ color: '#1e40af', fontSize: '24px' }}>Подтверждаем...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ color: '#1e40af', fontSize: '24px', marginBottom: '12px' }}>Подписка подтверждена!</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Вы успешно подписались на рассылку Инженер-центр.
            </p>
            <Link href="/" style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}>
              На главную
            </Link>
          </>
        )}
        {status === 'already' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👍</div>
            <h1 style={{ color: '#1e40af', fontSize: '24px', marginBottom: '12px' }}>Уже подписаны</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Этот email уже подтвержден и находится в нашей рассылке.
            </p>
            <Link href="/" style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}>
              На главную
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '12px' }}>Ссылка недействительна</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Ссылка устарела или недействительна. Попробуйте подписаться заново.
            </p>
            <Link href="/" style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}>
              На главную
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
