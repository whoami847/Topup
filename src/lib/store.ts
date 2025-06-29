
'use client';

import { create } from 'zustand';
import { 
    type User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    getIdTokenResult,
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
    increment,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { initialMainCategories, initialTopUpCategories } from './product-data';
import type { MainCategory, TopUpCategory, Product } from './products';
import type { PaymentMethod } from './payments';
import type { Gateway } from './gateways';
import { format } from 'date-fns';
import type { SiteSettings } from './settings';
import { defaultSiteSettings } from './settings-data';

export type Order = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  userId: string;
  productDetails?: any;
  gatewayId?: string;
  paymentDetails?: any;
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
    isBanned?: boolean;
    isAdmin?: boolean;
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
  paymentMethods: PaymentMethod[];
  gateways: Gateway[];
  siteSettings: SiteSettings | null;
  currentUser: User | null;
  isAuthLoading: boolean;
  isAuthDialogOpen: boolean;
  lastClearedWalletOrders: Order[];
  lastClearedWalletTransactions: Transaction[];
  init: () => void;
  setAuthDialogOpen: (open: boolean) => void;
  // Async actions
  registerUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  loginUser: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: Transaction['status']) => Promise<void>;
  purchaseWithBalance: (order: Omit<Order, 'id' | 'status' | 'userId'>) => Promise<{ success: boolean, message: string }>;
  updateOrderStatus: (orderId: string, status: 'COMPLETED' | 'FAILED') => Promise<void>;
  clearOrderHistory: () => Promise<void>;
  clearWalletHistory: () => Promise<void>;
  undoClearWalletHistory: () => Promise<void>;
  addMainCategory: (category: Omit<MainCategory, 'id'>) => Promise<MainCategory & { id: string }>;
  updateMainCategory: (id: string, category: Partial<Omit<MainCategory, 'id'>>) => Promise<void>;
  deleteMainCategory: (id: string) => Promise<void>;
  addTopUpCategory: (category: Omit<TopUpCategory, 'id'>, mainCategoryId: string) => Promise<void>;
  updateTopUpCategory: (id: string, category: Partial<Omit<TopUpCategory, 'id'>>, newMainCategoryId: string) => Promise<void>;
  deleteTopUpCategory: (id: string) => Promise<void>;
  addPricePoint: (topUpCategoryId: string, newProduct: Omit<Product, 'id'>) => Promise<void>;
  updatePricePoint: (topUpCategoryId: string, productId: string, updatedProduct: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deletePricePoint: (topUpCategoryId: string, productId: string) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updatePaymentMethod: (id: string, method: Partial<Omit<PaymentMethod, 'id'>>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  addGateway: (gateway: Omit<Gateway, 'id'>) => Promise<void>;
  updateGateway: (id: string, gateway: Partial<Omit<Gateway, 'id'>>) => Promise<void>;
  deleteGateway: (id: string) => Promise<void>;
  manageUserWallet: (userId: string, amount: number, type: 'add' | 'subtract', reason: string) => Promise<void>;
  toggleUserBanStatus: (userId: string, isBanned: boolean) => Promise<void>;
  toggleUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<void>;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
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
      paymentMethods: [],
      gateways: [],
      siteSettings: null,
      currentUser: null,
      isAuthLoading: true,
      isAuthDialogOpen: false,
      lastClearedWalletOrders: [],
      lastClearedWalletTransactions: [],

      init: () => {
          cleanupListeners(); // Clear any previous listeners
          set({ isAuthLoading: true });
          
          const seedDataIfNeeded = async () => {
            try {
                // Seed Product Data
                const mainCatRef = collection(db, 'mainCategories');
                const mainCatSnapshot = await getDocs(mainCatRef);
                if (mainCatSnapshot.empty) {
                    console.log('Database empty, seeding initial product data...');
                    const batch = writeBatch(db);
                    initialMainCategories.forEach(cat => {
                        const { id, ...data } = cat;
                        batch.set(doc(db, 'mainCategories', id), data);
                    });
                    initialTopUpCategories.forEach(cat => {
                        const { id, ...data } = cat;
                        batch.set(doc(db, 'topUpCategories', id), data);
                    });
                    await batch.commit();
                    console.log('Product data seeding complete.');
                }

                // Seed Site Settings
                const settingsDocRef = doc(db, 'siteSettings', 'main');
                const settingsDoc = await getDoc(settingsDocRef);
                if (!settingsDoc.exists()) {
                    console.log('Site settings not found, seeding with default data...');
                    await setDoc(settingsDocRef, defaultSiteSettings);
                    console.log('Site settings seeded successfully.');
                }
            } catch (error) {
                console.error("Error seeding data:", error);
            }
          };

          seedDataIfNeeded();

          // Public Listeners
          const unsubMain = onSnapshot(collection(db, 'mainCategories'), snapshot => {
              set({ mainCategories: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MainCategory)) });
          });
          const unsubTopUp = onSnapshot(collection(db, 'topUpCategories'), snapshot => {
              set({ topUpCategories: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TopUpCategory)) });
          });
          const unsubUsers = onSnapshot(collection(db, 'users'), snapshot => {
              set({ users: snapshot.docs.map(doc => ({ ...doc.data() } as User)) });
          });
           const unsubPaymentMethods = onSnapshot(collection(db, 'paymentMethods'), snapshot => {
              set({ paymentMethods: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod)) });
          });
           const unsubGateways = onSnapshot(collection(db, 'gateways'), snapshot => {
              set({ gateways: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gateway)) });
          });
          const unsubSettings = onSnapshot(doc(db, 'siteSettings', 'main'), (doc) => {
              if (doc.exists()) {
                  set({ siteSettings: doc.data() as SiteSettings });
              }
          });
          
          const unsubAuth = onAuthStateChanged(auth, async (user) => {
              const allSubs = [unsubMain, unsubTopUp, unsubUsers, unsubPaymentMethods, unsubGateways, unsubSettings, unsubAuth];
              // Detach all non-auth listeners
              unsubscribers.filter(unsub => !allSubs.includes(unsub)).forEach(unsub => unsub());

              if (user) {
                  const idTokenResult = await user.getIdTokenResult(true); // Force refresh to get latest claims
                  const isAdmin = idTokenResult.claims.admin === true;

                  const userDocSub = onSnapshot(doc(db, 'users', user.uid), async (userDoc) => {
                       if (!userDoc.exists()) {
                          console.log(`Creating user profile for ${user.uid}`);
                          const newUser: User = { uid: user.uid, email: user.email, balance: 0, isBanned: false, isAdmin };
                          await setDoc(doc(db, "users", user.uid), newUser);
                          set({ currentUser: newUser, balance: 0 });
                       } else {
                           const userData = userDoc.data() as User;
                           set({ currentUser: { ...userData, isAdmin }, balance: userData.balance });
                       }
                  });
                  
                  // Get all orders and transactions for admin, or user-specific for regular users.
                  // This is a simplified approach for now. A real-world app might check for an admin role.
                  const ordersQuery = query(collection(db, 'orders'));
                  const ordersSub = onSnapshot(ordersQuery, snapshot => {
                      set({ orders: snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Order) });
                  });
                  
                  const transactionsQuery = query(collection(db, 'transactions'));
                  const transactionsSub = onSnapshot(transactionsQuery, snapshot => {
                      set({ transactions: snapshot.docs.map(d => ({id: d.id, ...d.data()}) as Transaction) });
                  });

                  unsubscribers = [unsubMain, unsubTopUp, unsubUsers, unsubPaymentMethods, unsubGateways, unsubSettings, userDocSub, ordersSub, transactionsSub, unsubAuth];
              } else {
                  set({ currentUser: null, orders: [], transactions: [], balance: 0 });
                   unsubscribers = [unsubMain, unsubTopUp, unsubUsers, unsubPaymentMethods, unsubGateways, unsubSettings, unsubAuth];
              }
              set({ isAuthLoading: false });
          });
          unsubscribers = [unsubMain, unsubTopUp, unsubUsers, unsubPaymentMethods, unsubGateways, unsubSettings, unsubAuth];
      },

      setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),

      registerUser: async ({ email, password }) => {
        if (!password) return { success: false, message: "Password is required." };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUser: User = { uid: user.uid, email: user.email, balance: 0, isBanned: false, isAdmin: false };
            await setDoc(doc(db, "users", user.uid), newUser);
            return { success: true, message: "Registration successful!" };
        } catch (error: any) {
            return { success: false, message: "Registration failed: " + error.message };
        }
      },

      loginUser: async ({ email, password }) => {
        if (!password) return { success: false, message: "Password is required." };
    
        const specialAdminEmail = 'burnersshopadmin@admin.com';
    
        try {
            // Step 1: Try to sign in normally
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists() && userDoc.data().isBanned) {
                await signOut(auth);
                return { success: false, message: "This account has been banned." };
            }
    
            // Step 2: Bootstrap admin if it's the special admin user and not yet an admin
            if (userCredential.user.email === specialAdminEmail) {
                const tokenResult = await userCredential.user.getIdTokenResult();
                if (!tokenResult.claims.admin) {
                    console.log('Initial admin claim not found. Attempting to bootstrap...');
                    await get().toggleUserAdminStatus(userCredential.user.uid, true);
                    const freshToken = await userCredential.user.getIdTokenResult(true); 
                    
                    const userFromDb = (await getDoc(userDocRef)).data() as User;
                    set({ currentUser: { ...userFromDb, isAdmin: freshToken.claims.admin === true } });
                }
            }
    
            return { success: true, message: "Login successful!" };
        } catch (error: any) {
            // Step 3: If login fails, check if it's the special admin user who doesn't exist yet
            if (error.code === 'auth/user-not-found' && email === specialAdminEmail) {
                console.log("Admin user not found. Attempting to create and bootstrap admin...");
                try {
                    // Register the special admin user
                    const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                    
                    // Firestore user doc creation is handled by onAuthStateChanged listener,
                    // but we can set it here to be faster.
                    const newUser: User = { uid: newUserCredential.user.uid, email: newUserCredential.user.email, balance: 0, isBanned: false, isAdmin: true };
                    await setDoc(doc(db, "users", newUserCredential.user.uid), newUser);

                    // Now, promote them to admin
                    await get().toggleUserAdminStatus(newUserCredential.user.uid, true);
                    await newUserCredential.user.getIdTokenResult(true); // Force refresh
                    console.log('Admin account created and bootstrapped successfully.');
    
                    return { success: true, message: "Admin account created. Login successful!" };
                } catch (creationError: any) {
                    console.error("Failed to create and bootstrap admin user:", creationError);
                    return { success: false, message: "Failed to create admin account: " + creationError.message };
                }
            }
    
            // For all other errors, return the generic message
            console.error("Login failed:", error);
            return { success: false, message: "Invalid email or password." };
        }
      },
      
      logoutUser: async () => {
          await signOut(auth);
      },
      
      addTransaction: async (transaction) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("User not logged in.");
        await addDoc(collection(db, 'transactions'), { ...transaction, userId: currentUser.uid });
      },

      updateTransactionStatus: async (transactionId, status) => {
          const transactionRef = doc(db, 'transactions', transactionId);
          const transactionDocSnap = await getDoc(transactionRef);
          
          if (!transactionDocSnap.exists()) return;

          const transactionDoc = transactionDocSnap.data() as Transaction;
          
          if (transactionDoc.status === 'Pending' && status === 'Completed' && transactionDoc.amount > 0) {
              const userRef = doc(db, 'users', transactionDoc.userId);
              const batch = writeBatch(db);
              batch.update(transactionRef, { status });
              batch.update(userRef, { balance: increment(transactionDoc.amount) });
              await batch.commit();
          } else {
              await updateDoc(transactionRef, { status });
          }
      },

      purchaseWithBalance: async (orderData) => {
        const { currentUser, balance } = get();
        if (!currentUser) {
            return { success: false, message: "You must be logged in to make a purchase." };
        }
        if (balance < orderData.amount) {
            return { success: false, message: "Insufficient balance. Please top up your wallet." };
        }

        const batch = writeBatch(db);

        // 1. Create the order with PENDING status
        const orderRef = doc(collection(db, 'orders'));
        batch.set(orderRef, { 
            ...orderData, 
            userId: currentUser.uid, 
            status: 'PENDING',
        });

        // 2. Create a transaction record for the purchase
        const transactionRef = doc(collection(db, 'transactions'));
        batch.set(transactionRef, {
            date: orderData.date,
            description: orderData.description,
            amount: -orderData.amount, // Negative amount for purchase
            status: 'Completed',
            userId: currentUser.uid,
        });

        // 3. Decrement user's balance
        const userRef = doc(db, 'users', currentUser.uid);
        batch.update(userRef, { balance: increment(-orderData.amount) });

        try {
            await batch.commit();
            return { success: true, message: "Order placed successfully! It is now pending admin approval." };
        } catch (error) {
            console.error("Purchase failed:", error);
            return { success: false, message: "An error occurred during the purchase." };
        }
      },

      updateOrderStatus: async (orderId, status) => {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (!orderDoc.exists()) {
            console.error("Order not found");
            throw new Error("Order not found");
        }

        const order = { id: orderDoc.id, ...orderDoc.data() } as Order;
        
        if (order.status !== 'PENDING') {
            console.warn(`Order ${orderId} is not pending, cannot update status.`);
            return;
        }

        const batch = writeBatch(db);
        
        if (status === 'FAILED') {
            // Refund the user's balance
            const userRef = doc(db, 'users', order.userId);
            batch.update(userRef, { balance: increment(order.amount) });

            // Create a refund transaction
            const transactionRef = doc(collection(db, 'transactions'));
            const refundTransaction = {
                date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
                description: `Refund for failed order: ${order.description}`,
                amount: order.amount, // Positive amount for refund
                status: 'Completed',
                userId: order.userId,
            };
            batch.set(transactionRef, refundTransaction);
        }
        
        batch.update(orderRef, { status });

        await batch.commit();
      },
      
      clearOrderHistory: async () => {
          const batch = writeBatch(db);
          const ordersRef = collection(db, 'orders');
          const statusesToClear = ['COMPLETED', 'FAILED', 'CANCELLED'];
          
          const q = query(ordersRef, where('status', 'in', statusesToClear));
          
          try {
              const querySnapshot = await getDocs(q);
              if (querySnapshot.empty) {
                  console.log("No orders to clear.");
                  return;
              }
              
              let clearedCount = 0;
              querySnapshot.forEach(docSnap => {
                  const order = docSnap.data() as Order;
                  if (!order.description.toLowerCase().includes('wallet top-up')) {
                      batch.delete(docSnap.ref);
                      clearedCount++;
                  }
              });
      
              if (clearedCount > 0) {
                  await batch.commit();
              }
          } catch (error) {
              console.error("Error clearing order history: ", error);
              throw new Error("Failed to clear order history.");
          }
      },

      clearWalletHistory: async () => {
        const { orders, transactions } = get();
        const batch = writeBatch(db);

        const ordersToClear = orders.filter(o => 
            o.description.toLowerCase().includes('wallet top-up') && o.status !== 'PENDING'
        );
        const transactionsToClear = transactions.filter(t => 
            t.description.toLowerCase().includes('wallet top-up request') && t.status !== 'Pending'
        );

        if (ordersToClear.length === 0 && transactionsToClear.length === 0) {
            console.log("No wallet history to clear.");
            return;
        }

        set({ lastClearedWalletOrders: ordersToClear, lastClearedWalletTransactions: transactionsToClear });

        ordersToClear.forEach(o => batch.delete(doc(db, 'orders', o.id)));
        transactionsToClear.forEach(t => batch.delete(doc(db, 'transactions', t.id)));

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error clearing wallet history: ", error);
            set({ lastClearedWalletOrders: [], lastClearedWalletTransactions: [] }); // Clear temp state on failure
            throw new Error("Failed to clear wallet history.");
        }
    },

    undoClearWalletHistory: async () => {
        const { lastClearedWalletOrders, lastClearedWalletTransactions } = get();
        if (lastClearedWalletOrders.length === 0 && lastClearedWalletTransactions.length === 0) {
            return;
        }

        const batch = writeBatch(db);
        lastClearedWalletOrders.forEach(o => {
            const { id, ...data } = o;
            batch.set(doc(db, 'orders', id), data);
        });
        lastClearedWalletTransactions.forEach(t => {
            const { id, ...data } = t;
            batch.set(doc(db, 'transactions', id), data)
        });

        try {
            await batch.commit();
            set({ lastClearedWalletOrders: [], lastClearedWalletTransactions: [] }); // Clear temp state on success
        } catch (error) {
            console.error("Error undoing wallet history clearing: ", error);
            throw new Error("Failed to undo wallet history clearing.");
        }
    },

      addMainCategory: async (category) => {
        const docRef = await addDoc(collection(db, 'mainCategories'), category);
        return { ...category, id: docRef.id };
      },

      updateMainCategory: async (id, updatedData) => {
        const { id: _, ...dataToUpdate } = updatedData;
        await updateDoc(doc(db, 'mainCategories', id), dataToUpdate);
      },

      deleteMainCategory: async (id) => {
        await deleteDoc(doc(db, 'mainCategories', id));
      },

      addTopUpCategory: async (categoryData, mainCategoryId) => {
        const { slug } = categoryData;
        const newDocRef = await addDoc(collection(db, 'topUpCategories'), categoryData);
        
        const mainCatRef = doc(db, 'mainCategories', mainCategoryId);
        const mainCat = get().mainCategories.find(mc => mc.id === mainCategoryId);
        if (mainCat) {
            const batch = writeBatch(db);
            batch.update(mainCatRef, { subCategorySlugs: [...mainCat.subCategorySlugs, slug] });
            await batch.commit();
        }
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

      addPaymentMethod: async (method) => {
        await addDoc(collection(db, 'paymentMethods'), method);
      },

      updatePaymentMethod: async (id, updatedData) => {
        await updateDoc(doc(db, 'paymentMethods', id), updatedData);
      },

      deletePaymentMethod: async (id) => {
        await deleteDoc(doc(db, 'paymentMethods', id));
      },

      addGateway: async (gateway) => {
        await addDoc(collection(db, 'gateways'), gateway);
      },
      
      updateGateway: async (id, updatedData) => {
        await updateDoc(doc(db, 'gateways', id), updatedData);
      },

      deleteGateway: async (id) => {
        await deleteDoc(doc(db, 'gateways', id));
      },

      manageUserWallet: async (userId, amount, type, reason) => {
        const userRef = doc(db, 'users', userId);
        const batch = writeBatch(db);

        const newBalance = type === 'add' ? increment(amount) : increment(-amount);
        batch.update(userRef, { balance: newBalance });

        const transactionRef = doc(collection(db, 'transactions'));
        const newTransaction: Omit<Transaction, 'id'> = {
            date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
            description: `Admin adjustment: ${reason}`,
            amount: type === 'add' ? amount : -amount,
            status: 'Completed',
            userId: userId,
        };
        batch.set(transactionRef, newTransaction);
        
        await batch.commit();
      },

      toggleUserBanStatus: async (userId, isBanned) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { isBanned });
      },

      toggleUserAdminStatus: async (userId, isAdmin) => {
        const { currentUser } = get();
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }
        
        const idToken = await auth.currentUser.getIdToken();
        if (!idToken) {
            throw new Error("Authentication token not found.");
        }
        
        const response = await fetch('/api/user/set-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ userId, isAdmin }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user role.');
        }

        // After a successful role change, force a token refresh for the current user
        // if they are the one being changed. This ensures their own isAdmin status
        // is updated immediately on the client.
        if (currentUser?.uid === userId) {
          await auth.currentUser?.getIdToken(true);
        }
      },
      
      updateSiteSettings: async (newSettings: Partial<SiteSettings>) => {
        const settingsRef = doc(db, 'siteSettings', 'main');
        await updateDoc(settingsRef, newSettings);
      },

    })
);
