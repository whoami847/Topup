
import * as admin from 'firebase-admin';

// Initialize Firebase Admin only if not already initialized and if environment is properly configured
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    // Only initialize if we have the required environment variable
    // This prevents build-time errors when environment variables are not available
    if (serviceAccountJson) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
      });
      console.log('Firebase Admin SDK initialized successfully');
    } else {
      // In build time or when environment variables are not set, create a placeholder
      // The actual initialization will happen at runtime when environment variables are available
      console.warn('Firebase Admin SDK not initialized: FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set');
      
      // Only throw error if we're not in build time
      if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
        // We're in a server environment but not in production build
        // This is likely development mode where we need the credentials
        if (process.env.NEXT_PHASE !== 'phase-production-build') {
          console.error('Warning: Firebase Admin SDK requires FIREBASE_SERVICE_ACCOUNT_JSON environment variable for server-side operations');
        }
      }
    }
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // Don't throw the error, just log it to prevent build failures
  }
}

// Export the services, but handle cases where admin is not initialized
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
export default admin;
