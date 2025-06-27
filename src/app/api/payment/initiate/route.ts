
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';
import { getPaymentService } from '@/lib/payment-services';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        const gatewaysRef = collection(db, 'gateways');
        const q = query(gatewaysRef, where('enabled', '==', true), limit(1));
        const gatewaySnapshot = await getDocs(q);

        if (gatewaySnapshot.empty) {
            return NextResponse.json({ message: 'No active payment gateway found. Please configure a gateway in the admin panel.' }, { status: 500, headers: corsHeaders });
        }

        const gateway = gatewaySnapshot.docs[0].data() as Gateway;
        const paymentService = getPaymentService(gateway);

        if (!paymentService) {
            return NextResponse.json({ message: `Payment gateway "${gateway.name}" is not supported.` }, { status: 500, headers: corsHeaders });
        }

        const body = await req.json();
        const { order, user } = body;

        if (!order || !user) {
             return NextResponse.json({ message: 'Missing order or user data' }, { status: 400, headers: corsHeaders });
        }
        
        const tran_id = `topup_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const newOrder: Order = {
            ...order,
            id: tran_id,
            userId: user.uid,
            status: 'PENDING',
            gatewayId: gateway.id,
        };
        
        await setDoc(doc(db, "orders", tran_id), newOrder);
        
        const response = await paymentService.initiatePayment(newOrder, user.email, gateway);

        if (response.success && response.url) {
            return NextResponse.json({ url: response.url }, { headers: corsHeaders });
        } else {
            await setDoc(doc(db, "orders", tran_id), { status: 'FAILED' }, { merge: true });
            return NextResponse.json({ message: response.message || 'Payment initialization failed' }, { status: 500, headers: corsHeaders });
        }
    } catch (error) {
        console.error('Error in initiate payment:', error);
        let errorMessage = 'Internal Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500, headers: corsHeaders });
    }
}
