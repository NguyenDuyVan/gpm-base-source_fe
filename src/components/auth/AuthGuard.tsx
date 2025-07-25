import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Show nothing while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}
