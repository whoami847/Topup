
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerz from 'sslcommerz-lts';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const store_id = process.env.STORE_ID!;
const store_passwd = process.env.STORE_PASSWORD!;
const is_live = process.env.IS_LIVE === 'true';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { order, user } = body;

        if (!order || !user) {
             return NextResponse.json({ message: 'Missing order or user data' }, { status: 400 });
        }

        const tran_id = `topup_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const data = {
            total_amount: order.amount,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${process.env.CLIENT_URL}/api/payment/success/${tran_id}`,
            fail_url: `${process.env.CLIENT_URL}/api/payment/fail/${tran_id}`,
            cancel_url: `${process.env.CLIENT_URL}/api/payment/cancel/${tran_id}`,
            ipn_url: `${process.env.CLIENT_URL}/api/payment/ipn`,
            shipping_method: 'No',
            product_name: order.description,
            product_category: 'Digital Goods',
            product_profile: 'digital-goods',
            cus_name: user.email,
            cus_email: user.email,
            cus_add1: 'N/A',
            cus_city: 'N/A',
            cus_state: 'N/A',
            cus_postcode: 'N/A',
            cus_country: 'Bangladesh',
            cus_phone: 'N/A',
        };

        const newOrder = {
            ...order,
            id: tran_id, // Use tran_id as the document ID
            status: 'PENDING',
        };
        
        // Save the order to Firestore with PENDING status
        await setDoc(doc(db, "orders", tran_id), newOrder);

        const sslcz = new SSLCommerz(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json({ url: apiResponse.GatewayPageURL });
        } else {
            // If initialization fails, update the order status
            await setDoc(doc(db, "orders", tran_id), { status: 'FAILED' }, { merge: true });
            return NextResponse.json({ message: 'Payment initialization failed', error: apiResponse }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in initiate payment:', error);
        let errorMessage = 'Internal Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
