'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) { // check jwt
      logout();
      router.push('/login'); // redirect unauthenticated users to login
    }
  }, [router]);

  return isAuthenticated() ? <>{children}</> : null; //only if authenticated render components
}
//