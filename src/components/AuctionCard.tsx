import React, { useState, useEffect } from 'react';
import { Auction } from '../types';
import { cn, formatCurrency, getDomain, calculateTimeLeft, formatTimeLeft } from '../utils';
import { ExternalLink, Edit2, Trash2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  auction: Auction;
  onUpdate: (id: string, updates: Partial<Auction>) => void;
  onDelete: (id: string) => void;
}

export const AuctionCard: React.FC<Props> = ({ auction, onUpdate, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auction.endDate));
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(auction.currentPrice.toString());

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

  const handleUpdatePrice = () => {
    const val = parseFloat(newPrice);
    if (!isNaN(val)) {
      onUpdate(auction.id, { currentPrice: val });
    }
    setIsEditingPrice(false);
  };

  const priceRatio = auction.currentPrice / auction.maxPrice;
  const isDanger = priceRatio >= 1;
  const isWarning = priceRatio > 0.8 && !isDanger;

  return (
    <div className={cn(
      "auction-card bg-white border rounded-xl flex flex-col relative overflow-hidden transition-all",
      auction.status === 'won' ? "border-green-500 shadow-md shadow-green-100" :
      auction.status === 'lost' ? "border-slate-300 opacity-80" :
      isDanger ? "border-red-300 shadow-sm shadow-red-100" : "border-slate-200 shadow-sm"
    )}>
      
      <div className="p-5 flex flex-col gap-5 flex-1">
        
        {/* Header content inline */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 pr-2 truncate text-lg" title={auction.title}>
              {auction.title}
            </h3>
            <a
              href={auction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-blue-500 uppercase tracking-widest font-bold hover:underline mt-1"
            >
              <span className="truncate">Открыть лот →</span>
            </a>
          </div>
          
          <div className="shrink-0 flex gap-2">
            {auction.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Live
              </span>
            )}
            {auction.status === 'ended' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                Завершен
              </span>
            )}
            {auction.status === 'won' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                Победа
              </span>
            )}
            {auction.status === 'lost' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                Упущен
              </span>
            )}
          </div>
        </div>

        {/* Prices and Timer layout */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 whitespace-nowrap">
              Тек. ставка
            </span>
            {isEditingPrice ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onBlur={handleUpdatePrice}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdatePrice()}
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => auction.status === 'active' && setIsEditingPrice(true)}>
                <span className={cn(
                  "text-2xl tracking-tight font-black",
                  isDanger ? "text-red-600" : "text-slate-900"
                )}>
                  {formatCurrency(auction.currentPrice)}
                </span>
                {auction.status === 'active' && (
                  <p className="text-slate-300 group-hover:text-blue-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                    <Edit2 className="w-3.5 h-3.5" />
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 whitespace-nowrap flex items-center gap-1">
              {isDanger && <AlertCircle className="w-3 h-3 text-red-500" />}
              Осталось времени
            </span>
            <span className={cn(
              "text-sm",
              timeLeft <= 3600000 && timeLeft > 0 ? "font-bold text-red-500 animate-pulse timer-urgent" : "font-medium text-slate-600",
              timeLeft <= 0 && "text-slate-500"
            )}>
               {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress bar area */}
        <div className="mt-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5 tracking-wider">
            <span>ПРОГРЕСС БЮДЖЕТА</span>
            <span>{formatCurrency(auction.maxPrice)} (MAX)</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 relative",
                isDanger ? "bg-red-500" :
                isWarning ? "bg-yellow-500" : "bg-blue-500"
              )}
              style={{ width: `${Math.min(priceRatio * 100, 100)}%` }}
            />
          </div>
        </div>

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
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isDanger || auction.status === 'lost' ? "text-red-600" : 
              auction.status === 'won' ? "text-green-600" : "text-blue-600"
            )}>
              {auction.status === 'active' ? (isDanger ? 'ПРЕВЫШЕН ЛИМИТ' : 'В ПРЕДЕЛАХ ЛИМИТА') : 
               auction.status === 'won' ? 'ЛОТ ВАШ' : 'ТОРГИ ОКОНЧЕНЫ'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          {(auction.status === 'won' || auction.status === 'lost') && (
            <button
              onClick={() => onUpdate(auction.id, { status: 'active' })}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 hover:underline transition-colors cursor-pointer tracking-widest"
            >
               В Live
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
