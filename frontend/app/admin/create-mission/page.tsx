'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateMissionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [kindReward, setKindReward] = useState('');
  const [xrpReward, setXrpReward] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/missions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          description,
          kindReward: parseFloat(kindReward),
          xrpReward: parseFloat(xrpReward)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.push('/missions');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Créer une nouvelle mission</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Récompense KIND
              </label>
              <input
                type="number"
                value={kindReward}
                onChange={(e) => setKindReward(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Récompense XRP
              </label>
              <input
                type="number"
                value={xrpReward}
                onChange={(e) => setXrpReward(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Créer la mission
          </button>
        </form>
      </div>
    </div>
  );
} 