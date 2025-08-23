'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleDiscourseCallback } from '@/lib/auth';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = handleDiscourseCallback(searchParams);
    
    if (success) {
      // Redirect to dashboard on successful login
      router.push('/');
    } else {
      // Redirect back to login on failure
      router.push('/?error=auth_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}