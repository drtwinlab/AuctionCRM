import React, { useState, useMemo } from 'react';
import { Plus, ListFilter, TrendingUp, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { useAuctions } from './hooks/useAuctions';
import { AuctionForm } from './components/AuctionForm';
import { AuctionCard } from './components/AuctionCard';
import { formatCurrency, isEndingSoon } from './utils';
import { AuctionCategory, CATEGORY_LABELS } from './types';

export default function App() {
  const { auctions, addAuction, updateAuction, deleteAuction } = useAuctions();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'won' | 'lost'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory | 'all'>('all');

  const filteredAuctions = useMemo(() => {
    let sorted = [...auctions].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    if (filter !== 'all') {
      sorted = sorted.filter(a => filter === 'active' ? (a.status === 'active' || a.status === 'ended') : a.status === filter);
    }
    if (categoryFilter !== 'all') {
      sorted = sorted.filter(a => a.category === categoryFilter);
    }
    return sorted;
  }, [auctions, filter, categoryFilter]);

  const stats = useMemo(() => {
    const active = auctions.filter(a => a.status === 'active');
    const won = auctions.filter(a => a.status === 'won');
    const endingSoonCount = active.filter(a => isEndingSoon(a.endDate, 24)).length;
    const totalSpent = won.reduce((acc, curr) => acc + (curr.finalPrice ?? 0), 0);

    return { activeCount: active.length, endingSoonCount, wonCount: won.length, totalSpent };
  }, [auctions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 flex flex-col">
      {/* Header Pipeline */}
      <header className="h-16 bg-slate-900 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 text-white shadow-lg sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold italic text-lg">
            A
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">AuctionPulse<span className="font-normal text-blue-400 hidden sm:inline"> CRM</span></h1>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-blue-200"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Новый лот</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <ListFilter className="w-3.5 h-3.5" />
              <span>Активных</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.activeCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              <span>Скоро (24ч)</span>
            </div>
            <div className={`text-2xl font-black ${stats.endingSoonCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{stats.endingSoonCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Побед</span>
            </div>
            <div className="text-2xl font-black text-green-600">{stats.wonCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Wallet className="w-3.5 h-3.5" />
              <span>Потрачено</span>
            </div>
            <div className="text-2xl font-black text-blue-600">{formatCurrency(stats.totalSpent)}</div>
          </div>
        </div>

        {/* Add Form Expandable */}
        {showForm && (
          <AuctionForm 
            onAdd={addAuction} 
            onClose={() => setShowForm(false)} 
          />
        )}

        {/* Filters */}
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {([
              { id: 'all', label: 'Все лоты' },
              { id: 'active', label: 'Активные' },
              { id: 'won', label: 'Выигранные' },
              { id: 'lost', label: 'Проигранные' }
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm cursor-pointer ${
                  filter === f.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as AuctionCategory | 'all')}
            className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-auto"
          >
            <option value="all">Все категории</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <div className="py-20 text-center bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col items-center mt-2">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Нет аукционов в этой категории</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              Добавьте лоты, за которыми хотите следить, чтобы не упустить выгодные предложения.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 hover:underline underline-offset-4 cursor-pointer"
            >
              Добавить первый лот →
            </button>
          </div>
        )}

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onUpdate={updateAuction}
              onDelete={deleteAuction}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
