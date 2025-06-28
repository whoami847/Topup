
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection, query, where, getDocs, limit, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';
import { format } from 'date-fns';

const RUPANTORPAY_API_URL = 'https://payment.rupantorpay.com/api/payment/checkout';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, userId, customer_name, customer_email, customer_phone } = body;

        // Validate if userId is present
        if (!userId) {
            return NextResponse.json({ message: 'User ID is missing.' }, { status: 400 });
        }

        // Fetch user directly by ID to ensure they exist
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }
        
        // Fetch active gateway from Firestore
        const gatewaysRef = collection(db, 'gateways');
        const q = query(gatewaysRef, where('enabled', '==', true), limit(1));
        const gatewaySnapshot = await getDocs(q);

        if (gatewaySnapshot.empty) {
            return NextResponse.json({ message: 'No active payment gateway found.' }, { status: 500 });
        }
        
        const gateway = gatewaySnapshot.docs[0].data() as Gateway;

        // Generate a unique transaction ID
        const transaction_id = `TRN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        
        // Create an order document in Firestore
        const newOrder: Order = {
            id: transaction_id,
            date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
            description: `Wallet Top-up of ৳${amount}`,
            amount: Number(amount),
            status: 'PENDING',
            userId: userId,
            gatewayId: gateway.id,
            paymentDetails: { customer_name, customer_email, customer_phone }
        };
        await setDoc(doc(db, "orders", transaction_id), newOrder);

        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        // Prepare payload for RupantorPay
        const payload = {
            access_token: gateway.accessToken,
            transaction_id: transaction_id,
            amount: amount,
            success_url: `${baseUrl}/api/payment/callback?transaction_id=${transaction_id}&status=success`,
            fail_url: `${baseUrl}/api/payment/callback?transaction_id=${transaction_id}&status=fail`,
            cancel_url: `${baseUrl}/api/payment/callback?transaction_id=${transaction_id}&status=cancel`,
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone,
        };

        // Call RupantorPay API
        const response = await fetch(RUPANTORPAY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.payment_url) {
            return NextResponse.json({ payment_url: result.payment_url });
        } else {
            // Update order to FAILED if initiation fails
            await updateDoc(doc(db, "orders", transaction_id), { status: 'FAILED' });
            return NextResponse.json({ message: result.message || 'Payment initiation failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
