import { useState, useEffect } from 'react';
import { Auction, AuctionStatus } from '../types';
import { sendNotification, requestNotificationPermission } from '../utils';

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    try {
      const saved = localStorage.getItem('auction_crm_data_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    localStorage.setItem('auction_crm_data_v2', JSON.stringify(auctions));
  }, [auctions]);

  // Periodic check: auto-end auctions + send notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(currentAuctions => {
        let hasChanges = false;
        const now = Date.now();
        
        const updated = currentAuctions.map(a => {
          const timeLeft = new Date(a.endDate).getTime() - now;

          // Auto-end
          if (a.status === 'active' && timeLeft <= 0) {
            hasChanges = true;
            return { ...a, status: 'ended' as AuctionStatus };
          }

          // Notify 1 hour before end
          if (a.status === 'active' && !a.notified && timeLeft > 0 && timeLeft <= 60 * 60 * 1000) {
            hasChanges = true;
            sendNotification(
              '⚡ Аукцион скоро завершится!',
              `"${a.title}" — менее 1 часа до конца. Лимит: ${a.maxPrice}€`
            );
            return { ...a, notified: true };
          }

          return a;
        });

        return hasChanges ? updated : currentAuctions;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addAuction = (auctionData: Omit<Auction, 'id' | 'createdAt' | 'status' | 'notified'>) => {
    const newAuction: Auction = {
      ...auctionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: new Date(auctionData.endDate).getTime() <= Date.now() ? 'ended' : 'active',
      notified: false,
    };
    setAuctions(prev => [newAuction, ...prev]);
  };

  const updateAuction = (id: string, updates: Partial<Auction>) => {
    setAuctions(prev => prev.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  };

  const deleteAuction = (id: string) => {
    setAuctions(prev => prev.filter(a => a.id !== id));
  };

  return { 
    auctions, 
    addAuction, 
    updateAuction, 
    deleteAuction 
  };
}
