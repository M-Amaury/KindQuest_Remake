'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [keys, setKeys] = useState<{
    xrplSeed?: string;
    evmPrivateKey?: string;
    xrplAddress?: string;
    evmAddress?: string;
  } | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Stocker les clés pour les montrer à l'utilisateur
      setKeys({
        xrplSeed: data.xrplSeed,
        evmPrivateKey: data.evmPrivateKey,
        xrplAddress: data.user.xrplAddress,
        evmAddress: data.user.evmAddress,
      });

      // Rediriger après 10 secondes pour laisser le temps de sauvegarder les clés
      setTimeout(() => {
        router.push('/');
      }, 10000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (keys) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Compte créé avec succès!</h2>
          <div className="mb-4">
            <p className="text-red-600 font-bold mb-2">⚠️ IMPORTANT: Sauvegardez ces informations maintenant!</p>
            <div className="bg-gray-100 p-4 rounded">
              <p className="mb-2"><strong>XRPL Seed:</strong> {keys.xrplSeed}</p>
              <p className="mb-2"><strong>XRPL Address:</strong> {keys.xrplAddress}</p>
              <p className="mb-2"><strong>EVM Private Key:</strong> {keys.evmPrivateKey}</p>
              <p><strong>EVM Address:</strong> {keys.evmAddress}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Redirection automatique vers la page de connexion dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center">
          Déjà un compte?{' '}
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}