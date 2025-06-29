
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Please add it to your .env.local file.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error', e);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
