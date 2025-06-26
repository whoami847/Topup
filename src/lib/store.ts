
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
import { initialMainCategories, initialTopUpCategories } from './product-data';
import type { MainCategory, TopUpCategory, Product } from './products';


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
  userId: string;
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
  mainCategories: MainCategory[];
  topUpCategories: TopUpCategory[];
  currentUser: User | null;
  isAuthLoading: boolean;
  isAuthDialogOpen: boolean;
  setBalance: (newBalance: number) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (transactionId: string, status: Transaction['status']) => void;
  registerUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  loginUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  setAuthDialogOpen: (open: boolean) => void;
  _setCurrentUser: (user: FirebaseUser | null) => void;
  addMainCategory: (category: Omit<MainCategory, 'id'>) => void;
  updateMainCategory: (id: string, category: Partial<Omit<MainCategory, 'id'>>) => void;
  deleteMainCategory: (id: string) => void;
  addTopUpCategory: (category: Omit<TopUpCategory, 'id'>, mainCategoryId: string) => void;
  updateTopUpCategory: (id: string, category: Partial<Omit<TopUpCategory, 'id'>>, newMainCategoryId: string) => void;
  deleteTopUpCategory: (id: string) => void;
  addPricePoint: (topUpCategoryId: string, newProduct: Omit<Product, 'id'>) => void;
  updatePricePoint: (topUpCategoryId: string, productId: string, updatedProduct: Partial<Omit<Product, 'id'>>) => void;
  deletePricePoint: (topUpCategoryId: string, productId: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      balance: 1000,
      orders: [],
      transactions: [],
      users: [],
      mainCategories: initialMainCategories,
      topUpCategories: initialTopUpCategories,
      currentUser: null,
      isAuthLoading: true,
      isAuthDialogOpen: false,

      setBalance: (newBalance) => set({ balance: newBalance }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
      
      updateTransactionStatus: (transactionId, status) =>
        set((state) => {
          let newBalance = state.balance;
          const originalTransaction = state.transactions.find((t) => t.id === transactionId);

          if (!originalTransaction || originalTransaction.status !== 'Pending') {
            return {}; 
          }

          const newTransactions = state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status } : t
          );

          if (status === 'Completed' && originalTransaction.amount > 0) {
            newBalance += originalTransaction.amount;
          }

          return { transactions: newTransactions, balance: newBalance };
        }),

      _setCurrentUser: (user) => {
        if (user) {
          const newUser: User = { uid: user.uid, email: user.email };
          set((state) => {
            const userExists = state.users.some((u) => u.uid === user.uid);
            if (userExists) {
              return { currentUser: newUser, isAuthLoading: false };
            }
            return {
              currentUser: newUser,
              isAuthLoading: false,
              users: [...state.users, newUser],
            };
          });
        } else {
          set({ currentUser: null, isAuthLoading: false });
        }
      },

      registerUser: async ({ email, password }) => {
        if (!password) return { success: false, message: "Password is required." };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            if (user) {
                const newUser: User = { uid: user.uid, email: user.email };
                set(state => {
                    const userExists = state.users.some(u => u.uid === newUser.uid);
                    if (userExists) {
                        return { currentUser: newUser, isAuthLoading: false };
                    }
                    return {
                        currentUser: newUser,
                        isAuthLoading: false,
                        users: [...state.users, newUser],
                    };
                });
            }

            return { success: true, message: "Registration successful! You are now logged in." };
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
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              if (user) {
                  const loggedInUser: User = { uid: user.uid, email: user.email };
                  set({ currentUser: loggedInUser, isAuthLoading: false });
              }
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
      
      addMainCategory: (category) => {
        const newCategory: MainCategory = {
          ...category,
          id: `cat-${Date.now()}`,
          imageHint: category.title.toLowerCase().split(' ').slice(0, 2).join(' '),
          subCategorySlugs: []
        };
        set((state) => ({
          mainCategories: [...state.mainCategories, newCategory],
        }));
      },

      updateMainCategory: (id, updatedData) => {
        set((state) => ({
          mainCategories: state.mainCategories.map((cat) =>
            cat.id === id ? { ...cat, ...updatedData } : cat
          ),
        }));
      },

      deleteMainCategory: (id) => {
        set((state) => ({
          mainCategories: state.mainCategories.filter((cat) => cat.id !== id),
        }));
      },

      addTopUpCategory: (categoryData, mainCategoryId) => {
        const newCategory: TopUpCategory = {
          ...categoryData,
          id: `prod-cat-${Date.now()}`,
        };
        set((state) => {
          const newTopUpCategories = [...state.topUpCategories, newCategory];
          const newMainCategories = state.mainCategories.map((mainCat) => {
            if (mainCat.id === mainCategoryId) {
              return {
                ...mainCat,
                subCategorySlugs: [...mainCat.subCategorySlugs, newCategory.slug],
              };
            }
            return mainCat;
          });
          return {
            topUpCategories: newTopUpCategories,
            mainCategories: newMainCategories,
          };
        });
      },
      
      updateTopUpCategory: (id, updatedData, newMainCategoryId) => {
        set((state) => {
          const productToUpdate = state.topUpCategories.find((cat) => cat.id === id);
          if (!productToUpdate) return state;

          const oldSlug = productToUpdate.slug;
          const newSlug = updatedData.slug || oldSlug;

          let updatedMainCategories = state.mainCategories.map(mc => ({
              ...mc,
              subCategorySlugs: mc.subCategorySlugs.filter(s => s !== oldSlug)
          }));
          
          updatedMainCategories = updatedMainCategories.map(mc => {
              if (mc.id === newMainCategoryId) {
                  return {
                      ...mc,
                      subCategorySlugs: [...mc.subCategorySlugs, newSlug]
                  };
              }
              return mc;
          });
          
          const newTopUpCategories = state.topUpCategories.map((cat) =>
            cat.id === id ? { ...productToUpdate, ...updatedData } : cat
          );

          return { 
              topUpCategories: newTopUpCategories,
              mainCategories: updatedMainCategories,
           };
        });
      },

      deleteTopUpCategory: (id) => {
        set((state) => ({
          topUpCategories: state.topUpCategories.filter((cat) => cat.id !== id),
        }));
      },

      addPricePoint: (topUpCategoryId, newProduct) => {
        set((state) => ({
          topUpCategories: state.topUpCategories.map((category) => {
            if (category.id === topUpCategoryId) {
              const newProductWithId = { ...newProduct, id: `prod-item-${Date.now()}` };
              return { ...category, products: [...category.products, newProductWithId] };
            }
            return category;
          }),
        }));
      },

      updatePricePoint: (topUpCategoryId, productId, updatedProduct) => {
        set((state) => ({
          topUpCategories: state.topUpCategories.map((category) => {
            if (category.id === topUpCategoryId) {
              return {
                ...category,
                products: category.products.map((p) =>
                  p.id === productId ? { ...p, ...updatedProduct } : p
                ),
              };
            }
            return category;
          }),
        }));
      },

      deletePricePoint: (topUpCategoryId, productId) => {
        set((state) => ({
          topUpCategories: state.topUpCategories.map((category) => {
            if (category.id === topUpCategoryId) {
              return {
                ...category,
                products: category.products.filter((p) => p.id !== productId),
              };
            }
            return category;
          }),
        }));
      },

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
