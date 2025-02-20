'use client';

import { useState, useEffect } from 'react';

interface Participant {
  id: string;
  username: string;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  kindReward: number;
  xrpReward: number;
  participants: Participant[];
}

export default function ValidateMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/missions');
      if (!res.ok) throw new Error('Erreur lors du chargement des missions');
      const data = await res.json();
      // Filtrer pour ne garder que les missions avec des participants
      const missionsWithParticipants = data.missions.filter(
        (mission: Mission) => mission.participants.length > 0
      );
      setMissions(missionsWithParticipants);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (missionId: string, participantId: string) => {
    try {
      // 1. Valider la mission
      const res = await fetch('/api/missions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, participantId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la validation');
      }

      // 2. Rafraîchir la liste des missions
      await fetchMissions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Valider les missions</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {missions.length === 0 ? (
          <div className="text-gray-600">
            Aucune mission en attente de validation.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {missions.map((mission) => (
              <div key={mission.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3">{mission.name}</h2>
                <p className="text-gray-600 mb-4">{mission.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Récompense KIND:</span>
                    <span>{mission.kindReward} KIND</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Récompense XRP:</span>
                    <span>{mission.xrpReward} XRP</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Participants en attente de validation:</h3>
                  <div className="space-y-2">
                    {mission.participants.map((participant) => (
                      <div key={participant.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <span>{participant.username}</span>
                        <button
                          onClick={() => handleValidate(mission.id, participant.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Valider
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 