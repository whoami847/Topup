
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';
import { getPaymentService } from '@/lib/payment-services';

export async function POST(req: NextRequest) {
    try {
        const body = Object.fromEntries(await req.formData());
        
        // SSLCommerz uses 'tran_id', others might use something else.
        // This might need adjustment based on the gateway.
        const tran_id = body.tran_id as string;

        if (!tran_id) {
            return NextResponse.json({ message: 'Invalid IPN data: Missing transaction ID' }, { status: 400 });
        }

        const orderRef = doc(db, 'orders', tran_id);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        
        const orderData = orderDoc.data() as Order;
        
        // Prevent reprocessing a completed or failed order
        if (orderData.status !== 'PENDING') {
            return NextResponse.json({ message: `Order ${tran_id} already processed with status ${orderData.status}.` }, { status: 200 });
        }

        const gatewayId = orderData.gatewayId;
        if (!gatewayId) {
             return NextResponse.json({ message: 'Gateway ID missing from order' }, { status: 400 });
        }

        const gatewayRef = doc(db, 'gateways', gatewayId);
        const gatewayDoc = await getDoc(gatewayRef);

        if (!gatewayDoc.exists()) {
            return NextResponse.json({ message: 'Gateway configuration not found for this order' }, { status: 404 });
        }

        const gateway = gatewayDoc.data() as Gateway;
        const paymentService = getPaymentService(gateway);

        if (!paymentService) {
            return NextResponse.json({ message: `Payment gateway "${gateway.name}" is not supported.` }, { status: 500 });
        }
        
        const validationResponse = await paymentService.validateIPN(body, gateway);
        
        if (validationResponse.isValid) {
            await updateDoc(orderRef, {
                status: 'COMPLETED',
                paymentDetails: validationResponse.paymentDetails,
            });
            // TODO: Here you would trigger the actual top-up for the player
            // e.g., callTopUpAPI(orderData.productDetails.player_id, orderData.description);
        } else {
             await updateDoc(orderRef, {
                status: 'FAILED',
                paymentDetails: validationResponse.paymentDetails,
            });
        }
        
        return new NextResponse(null, { status: 200 });

    } catch (error) {
        console.error('Error in IPN handler:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
