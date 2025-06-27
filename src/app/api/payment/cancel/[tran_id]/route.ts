
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(
  req: NextRequest,
  { params }: { params: { tran_id: string } }
) {
  const { tran_id } = params;

  if (!tran_id) {
    return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
  }

  try {
    const orderRef = doc(db, 'orders', tran_id);
    await updateDoc(orderRef, {
      status: 'CANCELLED',
    });
    
    // Using environment variable for client URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${clientUrl}/payment/fail?status=cancelled`);
  } catch (error) {
    console.error('Error updating order status to CANCELLED:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
