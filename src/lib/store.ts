
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
    type User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from './firebase';


export type Order = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  userId: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type User = {
    uid: string;
    email: string | null;
};

type Credentials = {
    email: string;
    password?: string;
}

type AppState = {
  balance: number;
  orders: Order[];
  transactions: Transaction[];
  users: User[];
  currentUser: User | null;
  isAuthLoading: boolean;
  isAuthDialogOpen: boolean;
  setBalance: (newBalance: number) => void;
  addOrder: (order: Order) => void;
  addTransaction: (transaction: Transaction) => void;
  registerUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  loginUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  setAuthDialogOpen: (open: boolean) => void;
  _setCurrentUser: (user: FirebaseUser | null) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      balance: 1000,
      orders: [],
      transactions: [],
      users: [],
      currentUser: null,
      isAuthLoading: true,
      isAuthDialogOpen: false,
      setBalance: (newBalance) => set({ balance: newBalance }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
      
      _setCurrentUser: (user) => {
        if (user) {
          const newUser: User = { uid: user.uid, email: user.email };
          set((state) => {
            const userExists = state.users.some((u) => u.uid === user.uid);
            if (userExists) {
              return { currentUser: newUser, isAuthLoading: false };
            } else {
              return {
                currentUser: newUser,
                isAuthLoading: false,
                users: [...state.users, newUser],
              };
            }
          });
        } else {
          set({ currentUser: null, isAuthLoading: false });
        }
      },

      registerUser: async ({ email, password }) => {
        if (!password) return { success: false, message: "Password is required." };
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, message: "Registration successful! You can now log in." };
        } catch (error: any) {
            let message = "An unknown error occurred during registration.";
            if (error.code === 'auth/email-already-in-use') {
                message = "A user with this email already exists.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password is too weak. It should be at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                message = "Please enter a valid email address.";
            }
            return { success: false, message };
        }
      },

      loginUser: async ({ email, password }) => {
          if (!password) return { success: false, message: "Password is required." };
          try {
              await signInWithEmailAndPassword(auth, email, password);
              return { success: true, message: "Login successful!" };
          } catch (error: any) {
              return { success: false, message: "Invalid email or password." };
          }
      },
      
      logoutUser: async () => {
          await signOut(auth);
          set({ currentUser: null });
      },

      setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),
    }),
    {
      name: 'burner-store-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['isAuthDialogOpen', 'currentUser', 'isAuthLoading'].includes(key))
        ),
    }
  )
);
