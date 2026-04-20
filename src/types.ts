export type AuctionStatus = 'active' | 'won' | 'lost' | 'ended';

export type AuctionCategory = 'equipment' | 'electronics' | 'vehicles' | 'furniture' | 'tools' | 'other';

export const CATEGORY_LABELS: Record<AuctionCategory, string> = {
  equipment: 'Оборудование',
  electronics: 'Электроника',
  vehicles: 'Транспорт',
  furniture: 'Мебель',
  tools: 'Инструменты',
  other: 'Другое',
};

export interface Auction {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  maxPrice: number;
  finalPrice?: number;
  endDate: string;
  status: AuctionStatus;
  category: AuctionCategory;
  createdAt: string;
  notes?: string;
  notified?: boolean;
}
