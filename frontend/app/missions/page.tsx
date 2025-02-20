<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';

interface Mission {
  id: string;
  name: string;
  description: string;
  kindReward: number;
  xrpReward: number;
  isActive: boolean;
  participants: {
    id: string;
    username: string;
  }[];
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/missions');
      if (!res.ok) throw new Error('Erreur lors du chargement des missions');
      const data = await res.json();
      setMissions(data.missions);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleParticipate = async (missionId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/missions/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la participation');
      }

      // Rafraîchir la liste des missions
      await fetchMissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Missions disponibles</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {mission.participants.length > 0 && (
                  <div className="text-sm text-gray-500 mb-2">
                    {mission.participants.length} participant(s)
                  </div>
                )}
                
                <button
                  onClick={() => handleParticipate(mission.id)}
                  disabled={loading || mission.participants.some(p => p.id === mission.id)}
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    mission.participants.some(p => p.id === mission.id)
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {mission.participants.some(p => p.id === mission.id)
                    ? 'Déjà participant'
                    : 'Participer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
=======
export default function Missions(){
    return(
        <div>
            Missions
        </div>
    )
}
>>>>>>> 33e616bb7a10880010ae1f9104db245c76fbcef7
