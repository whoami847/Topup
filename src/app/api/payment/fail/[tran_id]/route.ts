
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
      status: 'FAILED',
    });

    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(`${baseUrl}/payment/fail`);

  } catch (error) {
    console.error('Error updating order status to FAILED:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
