'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  isAdmin?: boolean;
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (pathname === '/' || pathname === '/register') return null;

  if (loading) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/missions" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
              <span className="text-xl font-bold">KindQuest</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/missions" className="px-3 py-2 text-gray-700 hover:text-gray-900">
              Missions
            </Link>
            <Link href="/rewards" className="px-3 py-2 text-gray-700 hover:text-gray-900">
              Récompenses
            </Link>
            
            {user?.isAdmin && (
              <>
                <Link href="/admin/create-mission" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                  Créer Mission
                </Link>
                <Link href="/admin/validate" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                  Valider Missions
                </Link>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-red-600 hover:text-red-800"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 

