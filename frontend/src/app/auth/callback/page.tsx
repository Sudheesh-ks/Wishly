'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (token) {
        localStorage.setItem('wishly_user_token', token);
        await refreshUser();
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };

    handleCallback();
  }, [router, searchParams, refreshUser]);

  return <p style={{ color: 'white' }}>Signing you in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p style={{ color: 'white' }}>Loading...</p>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
