
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerz from 'sslcommerz-lts';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const store_id = process.env.STORE_ID!;
const store_passwd = process.env.STORE_PASSWORD!;
const is_live = process.env.IS_LIVE === 'true';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        if (!body.tran_id || !body.val_id) {
            return NextResponse.json({ message: 'Invalid IPN data' }, { status: 400 });
        }

        const sslcz = new SSLCommerz(store_id, store_passwd, is_live);
        const isValid = await sslcz.validate(body);

        if (isValid) {
            const orderRef = doc(db, 'orders', body.tran_id as string);
            const orderDoc = await getDoc(orderRef);

            if (orderDoc.exists()) {
                const orderData = orderDoc.data();
                // Check if already processed
                if (orderData.status === 'PENDING') {
                     await updateDoc(orderRef, {
                        status: 'COMPLETED',
                        paymentDetails: body, // Optionally save payment gateway response
                    });
                    
                    // --- TRIGGER TOP-UP LOGIC HERE ---
                    // Example: Call a function to deliver the in-game items
                    // deliverTopUp(orderData.playerId, orderData.productName);
                }
            }
            return new NextResponse(null, { status: 200 });
        } else {
             const orderRef = doc(db, 'orders', body.tran_id as string);
             await updateDoc(orderRef, {
                status: 'FAILED',
                paymentDetails: body,
            });
            return NextResponse.json({ message: 'IPN Validation Failed' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in IPN handler:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Ensure the body is parsed correctly
export const config = {
    api: {
        bodyParser: false,
    },
};
