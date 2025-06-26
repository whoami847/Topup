
import { createHash } from 'crypto';
import type { Gateway } from '../gateways';
import type { Order } from '../store';
import type {
  PaymentService,
  PaymentInitiationResponse,
  PaymentValidationResponse,
} from './types';

// TODO: Replace with the actual RupantorPay API endpoint.
const RUPANTORPAY_API_URL = 'https://secure.rupantorpay.com/api/v1/create-payment'; // This is a guess, please verify.

class RupantorPayService implements PaymentService {
  async initiatePayment(
    order: Omit<Order, 'id' | 'status'> & { id: string },
    userEmail: string,
    gateway: Gateway
  ): Promise<PaymentInitiationResponse> {
    
    // 1. Create the payload object required by RupantorPay.
    const payload = {
      store_id: gateway.storeId,
      tran_id: order.id,
      amount: order.amount,
      currency: 'BDT',
      product_name: order.description,
      cus_name: userEmail,
      cus_email: userEmail,
      success_url: `${process.env.CLIENT_URL}/api/payment/success/${order.id}`,
      fail_url: `${process.env.CLIENT_URL}/api/payment/fail/${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/api/payment/cancel/${order.id}`,
      ipn_url: `${process.env.CLIENT_URL}/api/payment/ipn`,
      // Other fields like cus_phone, cus_add1 might be needed.
    };

    // 2. Generate a request signature (hash).
    // This is a common pattern. Consult RupantorPay docs for the exact formula.
    // The format is often a concatenated string of key values + your store password/secret.
    const signatureString = `${gateway.storeId}|${order.id}|${order.amount}|${gateway.storePassword}`;
    const signature = createHash('sha256').update(signatureString).digest('hex');

    const requestPayload = {
      ...payload,
      signature: signature,
    };

    try {
      // 3. Make the POST request to RupantorPay's API endpoint.
      console.log('Initiating payment with RupantorPay with payload:', requestPayload);

      // --- Important: The following is a placeholder. You must enable it. ---
      // const response = await fetch(RUPANTORPAY_API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      //   },
      //   body: JSON.stringify(requestPayload),
      // });
      // const apiResponse = await response.json();

      // if (apiResponse && apiResponse.status === 'success' && apiResponse.payment_url) {
      //   return { success: true, url: apiResponse.payment_url };
      // } else {
      //   console.error("RupantorPay API Error:", apiResponse);
      //   return { success: false, message: apiResponse.message || 'Failed to get payment URL from RupantorPay.' };
      // }
      // --- End Placeholder ---

      // --- Temporary message for development ---
      console.warn("RupantorPay `initiatePayment` is not fully implemented. You need to uncomment the `fetch` call in `src/lib/payment-services/rupantorpay.ts` and provide the correct API endpoint URL.");
      return { success: false, message: "RupantorPay integration is not live yet. Please complete the setup." };
      // --- End Temporary message ---

    } catch (error) {
      console.error("RupantorPay initiation error:", error);
      return { success: false, message: "Could not connect to RupantorPay service." };
    }
  }

  async validateIPN(
    body: any,
    gateway: Gateway
  ): Promise<PaymentValidationResponse> {
    try {
      // 1. Securely validate the IPN. This is the most critical step.
      // RupantorPay should send a signature in the IPN body that you must verify.
      // The formula will be in their documentation. It's usually a hash of
      // some IPN fields and your store password.
      
      const receivedSignature = body.verify_sign; // This key name is a guess.
      const tran_id = body.tran_id;
      const amount = body.amount;
      const status = body.status; // e.g., 'VALID' or 'SUCCESS'

      if (!receivedSignature || !tran_id || !amount || !status) {
        console.error("RupantorPay IPN validation error: Missing required fields in IPN body.", body);
        return { isValid: false, transactionId: tran_id || 'unknown', status: 'FAILED', paymentDetails: body };
      }

      // Re-create the signature on your end to compare.
      // The order and fields must EXACTLY match the documentation.
      const validationString = `${tran_id}|${amount}|${status}|${gateway.storePassword}`;
      const expectedSignature = createHash('sha256').update(validationString).digest('hex');

      // Compare your generated signature with the one from RupantorPay.
      const isValid = receivedSignature === expectedSignature;
      
      if (!isValid) {
        console.error(`RupantorPay IPN hash mismatch for tran_id: ${tran_id}.`);
      }

      // Check if the payment status from the gateway is successful.
      const isPaymentSuccess = status === 'VALID' || status === 'SUCCESS'; // Adjust based on RupantorPay's status codes.
      
      return {
        isValid: isValid && isPaymentSuccess,
        transactionId: tran_id,
        status: isValid && isPaymentSuccess ? 'COMPLETED' : 'FAILED',
        paymentDetails: body,
      };

    } catch (error) {
       console.error("RupantorPay IPN validation error:", error);
       return {
         isValid: false,
         transactionId: body.tran_id || 'unknown',
         status: 'FAILED',
         paymentDetails: body,
       };
    }
  }
}

export const rupantorPayService = new RupantorPayService();
