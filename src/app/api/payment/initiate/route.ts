
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';
import { getPaymentService } from '@/lib/payment-services';

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://6000-firebase-studio-1750858380475.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-API-KEY, X-CLIENT",
};

export async function OPTIONS(req: NextRequest) {
  console.log('Handling CORS pre-flight request...');
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    console.log('/api/payment/initiate: Received POST request.');
    try {
        console.log('/api/payment/initiate: Processing payment initiation...');
        
        console.log('/api/payment/initiate: Fetching active payment gateways from Firestore...');
        const gatewaysRef = collection(db, 'gateways');
        const q = query(gatewaysRef, where('enabled', '==', true), limit(1));
        const gatewaySnapshot = await getDocs(q);

        if (gatewaySnapshot.empty) {
            console.error('/api/payment/initiate: No active payment gateway found.');
            return NextResponse.json({ message: 'No active payment gateway found. Please configure a gateway in the admin panel.' }, { status: 500, headers: corsHeaders });
        }
        
        const gateway = gatewaySnapshot.docs[0].data() as Gateway;
        console.log('/api/payment/initiate: Using gateway -', gateway.name);
        
        console.log('/api/payment/initiate: Getting payment service for gateway...');
        const paymentService = getPaymentService(gateway);

        if (!paymentService) {
             console.error('/api/payment/initiate: Payment service not supported for:', gateway.name);
            return NextResponse.json({ message: `Payment gateway "${gateway.name}" is not supported.` }, { status: 500, headers: corsHeaders });
        }
        
        console.log('/api/payment/initiate: Parsing request body...');
        const body = await req.json();
        console.log('/api/payment/initiate: Request body parsed:', body);
        const { order, user } = body;

        if (!order || !user) {
             console.error('/api/payment/initiate: Missing order or user data in request.');
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
        
        console.log('/api/payment/initiate: Creating new order document in Firestore...');
        await setDoc(doc(db, "orders", tran_id), newOrder);
        console.log('/api/payment/initiate: New order document created:', newOrder);

        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        console.log('/api/payment/initiate: Callback base URL determined as:', baseUrl);
        
        console.log('/api/payment/initiate: Calling paymentService.initiatePayment...');
        const response = await paymentService.initiatePayment(newOrder, user.email, gateway, baseUrl, req);
        console.log('/api/payment/initiate: Payment service response received:', response);

        if (response.success && response.url) {
            console.log('/api/payment/initiate: Successfully processed payment. Sending URL to frontend.');
            return NextResponse.json({ url: response.url }, { headers: corsHeaders });
        } else {
            console.error('/api/payment/initiate: Payment initialization failed. Reason from service:', response.message);
            await setDoc(doc(db, "orders", tran_id), { status: 'FAILED' }, { merge: true });
            return NextResponse.json({ message: response.message || 'Payment initialization failed' }, { status: 500, headers: corsHeaders });
        }
    } catch (error) {
        console.error('/api/payment/initiate: UNHANDLED CRITICAL ERROR in API route:', error);
        let errorMessage = 'Internal Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500, headers: corsHeaders });
    }
}
