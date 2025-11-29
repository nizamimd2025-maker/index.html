import { HistoryItem } from '../types';

const KEYS = {
  THEME: 'smartstudy_theme',
  PRO: 'smartstudy_is_pro',
  HISTORY: 'smartstudy_history',
};

export const getStoredTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
};

export const setStoredTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(KEYS.THEME, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getProStatus = (): boolean => {
  return localStorage.getItem(KEYS.PRO) === 'true';
};

export const setProStatus = (status: boolean) => {
  localStorage.setItem(KEYS.PRO, String(status));
};

export const saveToHistory = (item: HistoryItem) => {
  const history = getHistory();
  const updated = [item, ...history];
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
};

export const getHistory = (): HistoryItem[] => {
  const data = localStorage.getItem(KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const updateItemInHistory = (updatedItem: HistoryItem) => {
  const history = getHistory();
  const index = history.findIndex(q => q.id === updatedItem.id);
  if (index !== -1) {
    history[index] = updatedItem;
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  }
};