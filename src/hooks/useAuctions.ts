import { useState, useEffect } from 'react';
import { Auction, AuctionStatus } from '../types';

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    try {
      const saved = localStorage.getItem('auction_crm_data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('auction_crm_data', JSON.stringify(auctions));
  }, [auctions]);

  // Periodic check to auto-end auctions
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(currentAuctions => {
        let hasChanges = false;
        const now = new Date().getTime();
        
        const updated = currentAuctions.map(a => {
          if (a.status === 'active' && new Date(a.endDate).getTime() <= now) {
            hasChanges = true;
            return { ...a, status: 'ended' as AuctionStatus };
          }
          return a;
        });

        return hasChanges ? updated : currentAuctions;
      });
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const addAuction = (auctionData: Omit<Auction, 'id' | 'createdAt' | 'status'>) => {
    const newAuction: Auction = {
      ...auctionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: new Date(auctionData.endDate).getTime() <= Date.now() ? 'ended' : 'active'
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
