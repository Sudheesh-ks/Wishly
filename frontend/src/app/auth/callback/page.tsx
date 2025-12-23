'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router, searchParams]);

  return <p style={{ color: 'white' }}>Signing you in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p style={{ color: 'white' }}>Loading...</p>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
