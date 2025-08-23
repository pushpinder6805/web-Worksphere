'use client';

import { useState } from 'react';
import { getDiscourseLoginUrl, setToken, setUser } from '@/lib/auth';

export default function LoginPage() {

  const handleDiscourseLogin = () => {
    window.location.href = getDiscourseLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Worksphere
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="space-y-6">
          {/* Discourse Login */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sign in with Discourse
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Use your forum account to sign in
            </p>
            <button
              onClick={handleDiscourseLogin}
              className="w-full btn btn-primary bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            >
              Continue with Discourse
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <a
                href={process.env.NEXT_PUBLIC_DISCOURSE_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500"
              >
                Sign up on our forum
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}