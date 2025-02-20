'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import KindTokenABI from '../../public/KindToken.json';

interface Reward {
  id: number;
  name: string;
  description: string;
  kindCost: number;
}

export default function RewardsPage() {
  const [rewards] = useState<Reward[]>([
    {
      id: 1,
      name: "Réduction cinéma",
      description: "Billet de cinéma à -50%",
      kindCost: 100
    },
    {
      id: 2,
      name: "Ticket de train",
      description: "Trajet aller-retour en 2nde classe",
      kindCost: 500
    },
    {
      id: 3,
      name: "Cadeau surprise",
      description: "Un cadeau mystère !",
      kindCost: 250
    },
    {
      id: 4,
      name: "Bon d'achat",
      description: "10€ de réduction sur votre prochain achat",
      kindCost: 1000
    }
  ]);

  const [kindBalance, setKindBalance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKindBalance();
  }, []);

  const fetchKindBalance = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Erreur lors de la récupération de l\'utilisateur');
      const { user } = await res.json();
      
      if (!user?.evmAddress) {
        throw new Error("Adresse EVM manquante");
      }
  
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_PROVIDER_URL!);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_KIND_TOKEN_ADDRESS!,
        KindTokenABI.abi,
        provider
      );
  
      const balance = await contract.balanceOf(user.evmAddress);
      setKindBalance(ethers.formatUnits(balance, 18));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClaim = async (rewardId: number) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) throw new Error("Récompense non trouvée");

      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rewardId,
          rewardCost: reward.kindCost
        })
      });

      if (!res.ok) throw new Error('Erreur lors de la réclamation');
      
      await fetchKindBalance();
      alert(`Récompense "${reward.name}" réclamée avec succès !`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Échanger vos KIND</h1>
          <div className="bg-blue-100 px-4 py-2 rounded">
            <span className="font-bold">Solde KIND: </span>
            {kindBalance}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{reward.name}</h2>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              
              <div className="flex justify-between items-center">
                <p className="font-bold">Coût: {reward.kindCost} KIND</p>
                <button
                  onClick={() => handleClaim(reward.id)}
                  disabled={Number(kindBalance) < reward.kindCost}
                  className={`px-4 py-2 rounded ${
                    Number(kindBalance) >= reward.kindCost
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Échanger
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 