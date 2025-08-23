'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';

export default function UserMenu() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || user.username}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-sm font-medium">
              {(user.name || user.username).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-sm font-medium hidden sm:block">
          {user.name || user.username}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <div className="font-medium text-sm">{user.name || user.username}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            {user.is_advisor && (
              <div className="text-xs text-blue-600 mt-1">Advisor</div>
            )}
          </div>
          <div className="py-1">
            <a
              href="/settings"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </a>
            <a
              href="/profile"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </a>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}