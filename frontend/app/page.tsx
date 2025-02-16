'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Redirection vers le dashboard après connexion réussie
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">KindQuest</h1>
        <p className="text-gray-600">Accomplissez des missions, gagnez des récompenses</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Connexion</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-600">
            S'inscrire
          </Link>
        </p>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <h3 className="text-xl font-semibold mb-4">Comment ça marche ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold mb-2">Choisissez une mission</h4>
            <p>Parcourez les missions disponibles et sélectionnez celle qui vous inspire</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="font-bold mb-2">Accomplissez-la</h4>
            <p>Réalisez votre mission et partagez votre réussite</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🎁</div>
            <h4 className="font-bold mb-2">Gagnez des récompenses</h4>
            <p>Recevez des tokens KindQuest pour vos bonnes actions</p>
          </div>
        </div>
      </div>
    </div>
  );
}