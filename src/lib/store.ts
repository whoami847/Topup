
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

export type User = {
    id: string;
    email: string;
    password?: string; // In a real app, this would be a hash
};

type AppState = {
  balance: number;
  orders: Order[];
  transactions: Transaction[];
  users: User[];
  currentUser: User | null;
  isAuthDialogOpen: boolean;
  setBalance: (newBalance: number) => void;
  addOrder: (order: Order) => void;
  addTransaction: (transaction: Transaction) => void;
  registerUser: (newUser: Omit<User, 'id'>) => { success: boolean; message: string };
  loginUser: (credentials: Pick<User, 'email' | 'password'>) => { success: boolean; message: string };
  logoutUser: () => void;
  setAuthDialogOpen: (open: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      balance: 1000,
      orders: [],
      transactions: [],
      users: [],
      currentUser: null,
      isAuthDialogOpen: false,
      setBalance: (newBalance) => set({ balance: newBalance }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
      registerUser: (newUser) => {
        const { users } = get();
        if (users.some(u => u.email === newUser.email)) {
            return { success: false, message: "A user with this email already exists." };
        }
        const userWithId = { ...newUser, id: `user-${Date.now()}` };
        set(state => ({ users: [...state.users, userWithId] }));
        return { success: true, message: "Registration successful! You can now log in." };
      },
      loginUser: (credentials) => {
          const user = get().users.find(
              (u) => u.email === credentials.email && u.password === credentials.password
          );
          if (user) {
              set({ currentUser: user });
              return { success: true, message: "Login successful!" };
          }
          return { success: false, message: "Invalid email or password." };
      },
      logoutUser: () => set({ currentUser: null }),
      setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),
    }),
    {
      name: 'burner-store-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist a subset of the state
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['isAuthDialogOpen'].includes(key))
        ),
    }
  )
);
