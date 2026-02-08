"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'brand' | 'venue';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Redirect to home if not authenticated
      router.push('/');
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      // Redirect to home if user doesn't have required role
      router.push('/');
    }
  }, [session, status, requiredRole, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated or wrong role (will redirect)
  if (!session || (requiredRole && session.user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
