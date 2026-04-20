export type AuctionStatus = 'active' | 'won' | 'lost' | 'ended';

export interface Auction {
  id: string;
  title: string;
  url: string;
  currentPrice: number;
  maxPrice: number;
  endDate: string;
  status: AuctionStatus;
  createdAt: string;
  notes?: string;
}
