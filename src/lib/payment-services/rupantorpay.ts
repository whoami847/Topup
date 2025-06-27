
import type { Gateway } from '../gateways';
import type { Order } from '../store';
import type {
  PaymentService,
  PaymentInitiationResponse,
  PaymentValidationResponse,
} from './types';

// API Endpoints - User must confirm the sandbox URL.
const LIVE_API_URL = 'https://payment.rupantorpay.com/api/payment/checkout';
const SANDBOX_API_URL = 'https://sandbox.rupantorpay.com/api/payment/checkout'; // GUESS: User needs to verify this.

class RupantorPayService implements PaymentService {
  async initiatePayment(
    order: Omit<Order, 'id' | 'status'> & { id: string },
    userEmail: string,
    gateway: Gateway
  ): Promise<PaymentInitiationResponse> {
    const apiUrl = gateway.isLive ? LIVE_API_URL : SANDBOX_API_URL;
    
    // Construct the payload for RupantorPay API.
    // The fields here are based on common gateway practices.
    // User needs to confirm these with RupantorPay's documentation.
    const payload = {
      store_id: gateway.storeId,
      tran_id: order.id,
      amount: order.amount,
      currency: 'BDT',
      product_name: order.description,
      product_category: 'Digital Goods',
      cus_name: userEmail.split('@')[0], // Extract name from email as a fallback
      cus_email: userEmail,
      success_url: `${process.env.CLIENT_URL}/api/payment/success/${order.id}`,
      fail_url: `${process.env.CLIENT_URL}/api/payment/fail/${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/api/payment/cancel/${order.id}`,
      webhook_url: `${process.env.CLIENT_URL}/api/payment/ipn`, // This should point to your IPN listener
    };

    try {
      // Make the POST request to RupantorPay's API endpoint.
      console.log('Initiating payment with RupantorPay payload:', payload);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': gateway.storePassword, // Your Store Password/Secret from RupantorPay
          'X-CLIENT': gateway.storeId,     // Your Store ID from RupantorPay
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`RupantorPay API request failed with status ${response.status}:`, errorBody);
        return { success: false, message: `Failed to connect to RupantorPay. Status: ${response.status}` };
      }

      const apiResponse = await response.json();

      // Assuming the response contains a 'payment_url' on success.
      if (apiResponse && apiResponse.payment_url) {
        return { success: true, url: apiResponse.payment_url };
      } else {
        console.error("RupantorPay API Error:", apiResponse);
        const errorMessage = apiResponse.message || 'Failed to get payment URL from RupantorPay.';
        return { success: false, message: errorMessage };
      }

    } catch (error) {
      console.error("RupantorPay initiation error:", error);
      let message = "Could not connect to RupantorPay service.";
      if (error instanceof Error) {
        message = error.message;
      }
      return { success: false, message };
    }
  }

  async validateIPN(
    body: any,
    gateway: Gateway
  ): Promise<PaymentValidationResponse> {
    // The IPN body from RupantorPay. The field names are guesses.
    const transactionId = body.tran_id;
    const paymentStatus = body.status; // e.g., 'SUCCESS', 'FAILED'
    const receivedSignature = body.signature; // This is a guess, confirm with docs.

    try {
      // ** CRITICAL SECURITY STEP **
      // You MUST validate the incoming IPN to ensure it is from RupantorPay.
      // This usually involves creating a hash from the IPN data and your secret key
      // and comparing it to a signature sent in the IPN.
      // The logic below is a PLACEHOLDER. You must replace it with the
      // actual validation logic from RupantorPay's official documentation.

      // Example validation (replace with actual logic):
      // const validationString = `${transactionId}|${body.amount}|${paymentStatus}|${gateway.storePassword}`;
      // const expectedSignature = createHash('sha256').update(validationString).digest('hex');
      // const isSignatureValid = receivedSignature === expectedSignature;

      const isSignatureValid = true; // Placeholder - REMOVE and replace with real validation in production.
      if (!isSignatureValid) {
          console.error(`RupantorPay IPN signature mismatch for tran_id: ${transactionId}.`);
          return { isValid: false, transactionId, status: 'FAILED', paymentDetails: body };
      }

      // Check if the payment status from the gateway is successful.
      // The status value 'SUCCESS' is a guess. Please confirm with RupantorPay docs.
      const isPaymentSuccess = paymentStatus === 'SUCCESS';
      
      return {
        isValid: isPaymentSuccess,
        transactionId: transactionId,
        status: isPaymentSuccess ? 'COMPLETED' : 'FAILED',
        paymentDetails: body,
      };

    } catch (error) {
       console.error("RupantorPay IPN validation error:", error);
       return {
         isValid: false,
         transactionId: transactionId || 'unknown',
         status: 'FAILED',
         paymentDetails: body,
       };
    }
  }
}

export const rupantorPayService = new RupantorPayService();
