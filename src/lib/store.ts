
'use client';

import { create } from 'zustand';
import { 
    type User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    getDocs,
    setDoc,
    query,
    where,
    increment
} from 'firebase/firestore';
import { auth, db } from './firebase';
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
    balance: number;
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
  init: () => void;
  setAuthDialogOpen: (open: boolean) => void;
  // Async actions
  registerUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  loginUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'userId'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: Transaction['status']) => Promise<void>;
  addMainCategory: (category: Omit<MainCategory, 'id'>) => Promise<void>;
  updateMainCategory: (id: string, category: Partial<Omit<MainCategory, 'id'>>) => Promise<void>;
  deleteMainCategory: (id: string) => Promise<void>;
  addTopUpCategory: (category: Omit<TopUpCategory, 'id'>, mainCategoryId: string) => Promise<void>;
  updateTopUpCategory: (id: string, category: Partial<Omit<TopUpCategory, 'id'>>, newMainCategoryId: string) => Promise<void>;
  deleteTopUpCategory: (id: string) => Promise<void>;
  addPricePoint: (topUpCategoryId: string, newProduct: Omit<Product, 'id'>) => Promise<void>;
  updatePricePoint: (topUpCategoryId: string, productId: string, updatedProduct: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deletePricePoint: (topUpCategoryId: string, productId: string) => Promise<void>;
};

let unsubscribers: (() => void)[] = [];
const cleanupListeners = () => {
    unsubscribers.forEach(unsub => unsub());
    unsubscribers = [];
}

export const useAppStore = create<AppState>()(
    (set, get) => ({
      balance: 0,
      orders: [],
      transactions: [],
      users: [],
      mainCategories: [],
      topUpCategories: [],
      currentUser: null,
      isAuthLoading: true,
      isAuthDialogOpen: false,

      init: () => {
          cleanupListeners(); // Clear any previous listeners
          set({ isAuthLoading: true });
          
          const seedDataIfNeeded = async () => {
            const mainCatRef = collection(db, 'mainCategories');
            const snapshot = await getDocs(mainCatRef);
            if (snapshot.empty) {
                console.log('Database empty, seeding initial product data...');
                const batch = writeBatch(db);
                initialMainCategories.forEach(cat => {
                    batch.set(doc(db, 'mainCategories', cat.id), cat);
                });
                initialTopUpCategories.forEach(cat => {
                    batch.set(doc(db, 'topUpCategories', cat.id), cat);
                });
                await batch.commit();
                console.log('Data seeding complete.');
            }
          };

          seedDataIfNeeded();

          // Public Listeners
          const unsubMain = onSnapshot(collection(db, 'mainCategories'), snapshot => {
              set({ mainCategories: snapshot.docs.map(doc => ({ ...doc.data() } as MainCategory)) });
          });
          const unsubTopUp = onSnapshot(collection(db, 'topUpCategories'), snapshot => {
              set({ topUpCategories: snapshot.docs.map(doc => ({ ...doc.data() } as TopUpCategory)) });
          });
          const unsubUsers = onSnapshot(collection(db, 'users'), snapshot => {
              set({ users: snapshot.docs.map(doc => doc.data() as User) });
          });
          
          const unsubAuth = onAuthStateChanged(auth, user => {
              // Detach previous user-specific listeners
              unsubscribers = unsubscribers.filter(unsub => ![unsubMain, unsubTopUp, unsubUsers, unsubAuth].includes(unsub));
              cleanupListeners();
              unsubscribers = [unsubMain, unsubTopUp, unsubUsers, unsubAuth];

              if (user) {
                  const userDocSub = onSnapshot(doc(db, 'users', user.uid), userDoc => {
                      if (userDoc.exists()) {
                          const userData = userDoc.data() as User;
                          set({ currentUser: userData, balance: userData.balance });
                      }
                  });

                  const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
                  const ordersSub = onSnapshot(ordersQuery, snapshot => {
                      set({ orders: snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Order) });
                  });
                  
                  const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
                  const transactionsSub = onSnapshot(transactionsQuery, snapshot => {
                      set({ transactions: snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Transaction) });
                  });

                  unsubscribers.push(userDocSub, ordersSub, transactionsSub);
              } else {
                  set({ currentUser: null, orders: [], transactions: [], balance: 0 });
              }
              set({ isAuthLoading: false });
          });
          unsubscribers = [unsubMain, unsubTopUp, unsubUsers, unsubAuth];
      },

      setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),

      registerUser: async ({ email, password }) => {
        if (!password) return { success: false, message: "Password is required." };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUser: User = { uid: user.uid, email: user.email, balance: 0 };
            await setDoc(doc(db, "users", user.uid), newUser);
            return { success: true, message: "Registration successful!" };
        } catch (error: any) {
            return { success: false, message: "Registration failed: " + error.message };
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
      },

      addOrder: async (order) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("User not logged in.");
        const orderRef = collection(db, 'orders');
        await addDoc(orderRef, { ...order, userId: currentUser.uid });
      },

      updateOrderStatus: async (orderId, status) => {
        await updateDoc(doc(db, 'orders', orderId), { status });
      },
      
      addTransaction: async (transaction) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("User not logged in.");
        await addDoc(collection(db, 'transactions'), { ...transaction, userId: currentUser.uid });
      },

      updateTransactionStatus: async (transactionId, status) => {
          const transactionRef = doc(db, 'transactions', transactionId);
          const transactionDoc = get().transactions.find(t => t.id === transactionId);
          
          if (transactionDoc && transactionDoc.status === 'Pending' && status === 'Completed' && transactionDoc.amount > 0) {
              const userRef = doc(db, 'users', transactionDoc.userId);
              const batch = writeBatch(db);
              batch.update(transactionRef, { status });
              batch.update(userRef, { balance: increment(transactionDoc.amount) });
              await batch.commit();
          } else {
              await updateDoc(transactionRef, { status });
          }
      },

      addMainCategory: async (category) => {
        const newId = `cat-${Date.now()}`;
        await setDoc(doc(db, 'mainCategories', newId), { ...category, id: newId });
      },

      updateMainCategory: async (id, updatedData) => {
        await updateDoc(doc(db, 'mainCategories', id), updatedData);
      },

      deleteMainCategory: async (id) => {
        await deleteDoc(doc(db, 'mainCategories', id));
      },

      addTopUpCategory: async (categoryData, mainCategoryId) => {
        const newId = `prod-cat-${Date.now()}`;
        const newCategory = { ...categoryData, id: newId };
        
        const batch = writeBatch(db);
        batch.set(doc(db, 'topUpCategories', newId), newCategory);

        const mainCatRef = doc(db, 'mainCategories', mainCategoryId);
        const mainCat = get().mainCategories.find(mc => mc.id === mainCategoryId);
        if (mainCat) {
           batch.update(mainCatRef, { subCategorySlugs: [...mainCat.subCategorySlugs, newCategory.slug] });
        }
        await batch.commit();
      },
      
      updateTopUpCategory: async (id, updatedData, newMainCategoryId) => {
        const productToUpdate = get().topUpCategories.find((cat) => cat.id === id);
        if (!productToUpdate) return;

        const batch = writeBatch(db);
        batch.update(doc(db, 'topUpCategories', id), updatedData);
        
        const oldSlug = productToUpdate.slug;
        const newSlug = updatedData.slug || oldSlug;
        const oldMainCat = get().mainCategories.find(mc => mc.subCategorySlugs.includes(oldSlug));

        if (oldMainCat && oldMainCat.id !== newMainCategoryId) {
            batch.update(doc(db, 'mainCategories', oldMainCat.id), {
                subCategorySlugs: oldMainCat.subCategorySlugs.filter(s => s !== oldSlug)
            });
            const newMainCat = get().mainCategories.find(mc => mc.id === newMainCategoryId);
            if (newMainCat) {
                batch.update(doc(db, 'mainCategories', newMainCat.id), {
                    subCategorySlugs: [...newMainCat.subCategorySlugs, newSlug]
                });
            }
        }
        await batch.commit();
      },

      deleteTopUpCategory: async (id) => {
         await deleteDoc(doc(db, 'topUpCategories', id));
      },

      addPricePoint: async (topUpCategoryId, newProduct) => {
        const category = get().topUpCategories.find(c => c.id === topUpCategoryId);
        if (!category) return;
        const newProducts = [...category.products, { ...newProduct, id: `prod-item-${Date.now()}` }];
        await updateDoc(doc(db, 'topUpCategories', topUpCategoryId), { products: newProducts });
      },

      updatePricePoint: async (topUpCategoryId, productId, updatedProduct) => {
        const category = get().topUpCategories.find(c => c.id === topUpCategoryId);
        if (!category) return;
        const newProducts = category.products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p);
        await updateDoc(doc(db, 'topUpCategories', topUpCategoryId), { products: newProducts });
      },

      deletePricePoint: async (topUpCategoryId, productId) => {
        const category = get().topUpCategories.find(c => c.id === topUpCategoryId);
        if (!category) return;
        const newProducts = category.products.filter(p => p.id !== productId);
        await updateDoc(doc(db, 'topUpCategories', topUpCategoryId), { products: newProducts });
      },
    })
);
