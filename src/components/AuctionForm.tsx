import React, { useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { Auction, AuctionCategory, CATEGORY_LABELS } from '../types';

interface Props {
  onAdd: (auction: Omit<Auction, 'id' | 'createdAt' | 'status' | 'notified'>) => void;
  onClose: () => void;
}

export function AuctionForm({ onAdd, onClose }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    imageUrl: '',
    maxPrice: '',
    endDate: '',
    category: 'other' as AuctionCategory,
    notes: ''
  });

  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title: formData.title,
      url: formData.url,
      imageUrl: formData.imageUrl || undefined,
      maxPrice: parseFloat(formData.maxPrice) || 0,
      endDate: formData.endDate,
      category: formData.category,
      notes: formData.notes || undefined,
    });
    onClose();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Новый лот</h2>
          <p className="text-xs text-slate-500 mt-0.5">Добавьте лот для отслеживания</p>
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
                placeholder="Промышленный компрессор Atlas Copco"
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
                placeholder="https://troostwijkauctions.com/lot/..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Мой лимит (€)</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={formData.maxPrice}
                onChange={e => setFormData(p => ({...p, maxPrice: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Категория</label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({...p, category: e.target.value as AuctionCategory}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Дата и время окончания</label>
              <input
                required
                type="datetime-local"
                value={formData.endDate}
                onChange={e => setFormData(p => ({...p, endDate: e.target.value}))}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <ImagePlus className="w-3 h-3" />
                Фото (URL)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => {
                  setFormData(p => ({...p, imageUrl: e.target.value}));
                  setShowImagePreview(!!e.target.value);
                }}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="https://...image.jpg (необязательно)"
              />
              {showImagePreview && formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-20 w-20">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={() => setShowImagePreview(false)}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Заметки</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(p => ({...p, notes: e.target.value}))}
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400 resize-none"
                placeholder="Без блока питания, царапина на корпусе..."
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
