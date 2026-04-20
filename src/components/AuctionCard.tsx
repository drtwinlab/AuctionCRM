import React, { useState, useEffect } from 'react';
import { Auction, CATEGORY_LABELS } from '../types';
import { cn, formatCurrency, getDomain, calculateTimeLeft, formatTimeLeft, isEndingSoon } from '../utils';
import { ExternalLink, Trash2, Clock, AlertCircle, Tag, StickyNote, DollarSign } from 'lucide-react';

interface Props {
  auction: Auction;
  onUpdate: (id: string, updates: Partial<Auction>) => void;
  onDelete: (id: string) => void;
}

export const AuctionCard: React.FC<Props> = ({ auction, onUpdate, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auction.endDate));
  const [isEditingFinalPrice, setIsEditingFinalPrice] = useState(false);
  const [finalPrice, setFinalPrice] = useState(auction.finalPrice?.toString() || '');

  useEffect(() => {
    if (auction.status !== 'active') return;
    
    const timer = setInterval(() => {
      const left = calculateTimeLeft(auction.endDate);
      setTimeLeft(left);
      if (left <= 0 && auction.status === 'active') {
        onUpdate(auction.id, { status: 'ended' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endDate, auction.status, auction.id, onUpdate]);

  const handleSaveFinalPrice = () => {
    const val = parseFloat(finalPrice);
    if (!isNaN(val) && val >= 0) {
      onUpdate(auction.id, { finalPrice: val });
    }
    setIsEditingFinalPrice(false);
  };

  const endingSoon = isEndingSoon(auction.endDate, 24);

  return (
    <div className={cn(
      "auction-card bg-white border rounded-xl flex flex-col relative overflow-hidden transition-all",
      auction.status === 'won' ? "border-green-500 shadow-md shadow-green-100" :
      auction.status === 'lost' ? "border-slate-300 opacity-70" :
      endingSoon ? "border-amber-300 shadow-sm shadow-amber-50" : "border-slate-200 shadow-sm"
    )}>

      {/* Image */}
      {auction.imageUrl && (
        <div className="h-40 w-full bg-slate-100 overflow-hidden">
          <img 
            src={auction.imageUrl} 
            alt={auction.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      
      <div className="p-5 flex flex-col gap-4 flex-1">
        
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 pr-2 text-lg leading-tight" title={auction.title}>
              {auction.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <a
                href={auction.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-blue-500 uppercase tracking-widest font-bold hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {getDomain(auction.url)}
              </a>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <Tag className="w-3 h-3" />
                {CATEGORY_LABELS[auction.category] || 'Другое'}
              </span>
            </div>
          </div>
          
          <div className="shrink-0">
            {auction.status === 'active' && !endingSoon && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-blue-50 text-blue-700 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Live
              </span>
            )}
            {auction.status === 'active' && endingSoon && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Скоро!
              </span>
            )}
            {auction.status === 'ended' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Завершен
              </span>
            )}
            {auction.status === 'won' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-green-50 text-green-700 border border-green-200">
                Победа
              </span>
            )}
            {auction.status === 'lost' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-red-50 text-red-700 border border-red-200">
                Упущен
              </span>
            )}
          </div>
        </div>

        {/* Limit and Timer */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
              Мой лимит
            </span>
            <span className="text-2xl tracking-tight font-black text-slate-900">
              {formatCurrency(auction.maxPrice)}
            </span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft > 0 ? 'Осталось' : 'Время'}
            </span>
            <span className={cn(
              "text-sm",
              timeLeft <= 3600000 && timeLeft > 0 ? "font-bold text-red-500 animate-pulse" : "font-medium text-slate-600",
              timeLeft <= 0 && "text-slate-400"
            )}>
               {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>

        {/* Final price for won auctions */}
        {auction.status === 'won' && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-green-600 tracking-widest flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Итоговая цена
            </span>
            {isEditingFinalPrice ? (
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-28 bg-white border border-green-300 rounded px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-right"
                autoFocus
                placeholder="0"
                onBlur={handleSaveFinalPrice}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveFinalPrice()}
              />
            ) : (
              <span 
                className="text-lg font-black text-green-700 cursor-pointer hover:underline"
                onClick={() => setIsEditingFinalPrice(true)}
                title="Нажмите чтобы изменить"
              >
                {auction.finalPrice != null ? formatCurrency(auction.finalPrice) : 'Указать →'}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {auction.notes && (
          <div className="flex items-start gap-1.5 text-xs text-slate-500">
            <StickyNote className="w-3 h-3 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{auction.notes}</span>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 border-t border-slate-100 p-3 px-5 flex items-center flex-wrap gap-3 justify-between">
        <div className="flex items-center gap-2">
          {auction.status === 'ended' ? (
            <>
              <button
                onClick={() => onUpdate(auction.id, { status: 'won' })}
                className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-green-100 text-green-700 hover:bg-green-200 transition-colors rounded shadow-sm border border-green-200/50 cursor-pointer"
              >
                Я выиграл
              </button>
              <button
                onClick={() => onUpdate(auction.id, { status: 'lost' })}
                className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-white text-slate-600 hover:bg-slate-100 transition-colors rounded shadow-sm border border-slate-200 cursor-pointer"
              >
                Упустил
              </button>
            </>
          ) : (
            <a
              href={auction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors rounded shadow-sm border border-blue-100 cursor-pointer inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              Открыть лот
            </a>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          {(auction.status === 'won' || auction.status === 'lost') && (
            <button
              onClick={() => onUpdate(auction.id, { status: 'active', finalPrice: undefined })}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 hover:underline transition-colors cursor-pointer tracking-widest"
            >
              Вернуть в Live
            </button>
          )}
          <button
            onClick={() => onDelete(auction.id)}
            className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer shadow-sm"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
