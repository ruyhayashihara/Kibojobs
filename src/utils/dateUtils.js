import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'yyyy/MM/dd') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ja });
};

export const formatDateJapanese = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  const year = dateObj.getFullYear();
  const reiwaYear = year - 2018;
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  
  return `令和${reiwaYear}年${month}月${day}日`;
};

export const formatDateISO = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy/MM/dd');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
};
