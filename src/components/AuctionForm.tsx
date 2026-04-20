import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Auction } from '../types';

interface Props {
  onAdd: (auction: Omit<Auction, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
}

export function AuctionForm({ onAdd, onClose }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    currentPrice: '',
    maxPrice: '',
    endDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title: formData.title,
      url: formData.url,
      currentPrice: parseFloat(formData.currentPrice) || 0,
      maxPrice: parseFloat(formData.maxPrice) || 0,
      endDate: formData.endDate,
      notes: formData.notes
    });
    onClose();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Новый лот
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Добавьте данные аукциона для отслеживания</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Название лота</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="iPhone 15 Pro Max"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Ссылка на аукцион</label>
              <input
                required
                type="url"
                value={formData.url}
                onChange={e => setFormData(p => ({...p, url: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="https://ebay.com/item/..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Текущая цена (€)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.currentPrice}
                onChange={e => setFormData(p => ({...p, currentPrice: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Мой лимит - Макс. цена (€)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.maxPrice}
                onChange={e => setFormData(p => ({...p, maxPrice: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="5000"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Дата и время окончания</label>
              <input
                required
                type="datetime-local"
                value={formData.endDate}
                onChange={e => setFormData(p => ({...p, endDate: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md shadow-blue-200 cursor-pointer"
          >
            Добавить в CRM
          </button>
        </div>
      </form>
    </div>
  );
}
