
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { doc, updateDoc } from 'firebase/firestore';

async function verifyAdminFromToken(request: NextRequest): Promise<boolean> {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return decodedToken.admin === true;
    } catch (error) {
      console.error('Error verifying admin token:', error);
      return false;
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const isCallerAdmin = await verifyAdminFromToken(req);
    if (!isCallerAdmin) {
      return NextResponse.json({ message: 'Forbidden: Caller is not an admin' }, { status: 403 });
    }

    const { userId, isAdmin } = await req.json();
    if (!userId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ message: 'Bad Request: userId and isAdmin (boolean) are required' }, { status: 400 });
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(userId, { admin: isAdmin });
    
    // Also update the user's document in Firestore for easy querying
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
