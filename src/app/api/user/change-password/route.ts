
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

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

    const { userId, newPassword } = await req.json();
    if (!userId || !newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ message: 'Bad Request: userId and a valid newPassword (min 6 chars) are required' }, { status: 400 });
    }
    
    await adminAuth.updateUser(userId, {
      password: newPassword,
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
