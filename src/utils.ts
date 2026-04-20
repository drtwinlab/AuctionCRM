export const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ');

export const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'Ссылка';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(amount);
};

export const calculateTimeLeft = (endDate: string) => {
  const difference = new Date(endDate).getTime() - new Date().getTime();
  return difference > 0 ? difference : 0;
};

export const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return 'Завершено';
  
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / 1000 / 60) % 60);
  const s = Math.floor((ms / 1000) % 60);
  
  if (d > 0) {
    return `${d}д ${h}ч ${m}м`;
  }
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
