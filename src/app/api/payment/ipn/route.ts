
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerz from 'sslcommerz-lts';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';

export async function POST(req: NextRequest) {
    try {
        const body = Object.fromEntries(await req.formData());
        const tran_id = body.tran_id as string;

        if (!tran_id || !body.val_id) {
            return NextResponse.json({ message: 'Invalid IPN data' }, { status: 400 });
        }

        const orderRef = doc(db, 'orders', tran_id);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        
        const orderData = orderDoc.data() as Order;
        const gatewayId = orderData.gatewayId;

        if (!gatewayId) {
             return NextResponse.json({ message: 'Gateway ID missing from order' }, { status: 400 });
        }

        const gatewayRef = doc(db, 'gateways', gatewayId);
        const gatewayDoc = await getDoc(gatewayRef);

        if (!gatewayDoc.exists()) {
            return NextResponse.json({ message: 'Gateway configuration not found' }, { status: 404 });
        }

        const gateway = gatewayDoc.data() as Gateway;
        const sslcz = new SSLCommerz(gateway.storeId, gateway.storePassword, gateway.isLive);
        const isValid = await sslcz.validate(body);
        
        if (isValid) {
            if (orderData.status === 'PENDING') {
                 await updateDoc(orderRef, {
                    status: 'COMPLETED',
                    paymentDetails: body,
                });
            }
            return new NextResponse(null, { status: 200 });
        } else {
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
