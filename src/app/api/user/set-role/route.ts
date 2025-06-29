
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { doc, updateDoc } from 'firebase/firestore';

// This function is now only used for getting the caller's identity
async function getDecodedToken(request: NextRequest): Promise<admin.auth.DecodedIdToken | null> {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      return await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const decodedToken = await getDecodedToken(req);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { userId, isAdmin } = await req.json();
    if (!userId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ message: 'Bad Request: userId and isAdmin (boolean) are required' }, { status: 400 });
    }

    const isCallerAdmin = decodedToken.admin === true;
    
    // Special bootstrap case: Allow self-promotion only for the hardcoded admin email if they aren't an admin yet.
    // This is a secure way to create the very first admin.
    const isBootstrapAttempt =
        decodedToken.uid === userId &&
        decodedToken.email === 'burnersshopadmin@admin.com' &&
        isAdmin === true &&
        !isCallerAdmin;

    // The user must either be an admin already, or be the special user trying to bootstrap themselves.
    if (!isCallerAdmin && !isBootstrapAttempt) {
        return NextResponse.json({ message: 'Forbidden: Caller is not an admin' }, { status: 403 });
    }
    
    // Allow the current admin to demote themselves, but not the bootstrap user
    if (isCallerAdmin && decodedToken.uid === userId && !isAdmin) {
        // This check prevents the main admin from accidentally removing their own admin rights.
        if (decodedToken.email === 'burnersshopadmin@admin.com') {
             return NextResponse.json({ message: 'Forbidden: The main admin account cannot be demoted.' }, { status: 403 });
        }
    }

    // Set custom claims in Firebase Auth
    await adminAuth.setCustomUserClaims(userId, { admin: isAdmin });
    
    // Update the user's document in Firestore for easy querying on the client
    const userDocRef = doc(adminDb, 'users', userId);
    await updateDoc(userDocRef, { isAdmin: isAdmin });

    return NextResponse.json({ success: true, message: `User role updated successfully.` }, { status: 200 });
  } catch (error: any) {
    console.error('Error setting user role:', error);
    let errorMessage = 'Internal Server Error';
    if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found.';
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
