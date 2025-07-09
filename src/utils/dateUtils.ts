import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM dd, yyyy, h:mm a');
};

export const getDateColor = (date: Date): string => {
  if (isPast(date) && !isToday(date)) {
    return 'text-red-400';
  }
  if (isToday(date)) {
    return 'text-yellow-400';
  }
  return 'text-gray-400';
};