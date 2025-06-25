
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Order = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
};

type AppState = {
  balance: number;
  orders: Order[];
  transactions: Transaction[];
  setBalance: (newBalance: number) => void;
  addOrder: (order: Order) => void;
  addTransaction: (transaction: Transaction) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      balance: 0,
      orders: [],
      transactions: [],
      setBalance: (newBalance) => set({ balance: newBalance }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
    }),
    {
      name: 'burner-store-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
