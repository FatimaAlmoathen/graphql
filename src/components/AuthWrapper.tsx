'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) { // check jwt
      router.push('/login'); // redirect unauthenticated users to login
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>; //only if authenticated render components
}