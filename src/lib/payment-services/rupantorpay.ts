
import type { Gateway } from '../gateways';
import type { Order } from '../store';
import type {
  PaymentService,
  PaymentInitiationResponse,
  PaymentValidationResponse,
} from './types';

// API Endpoints provided by the user.
const LIVE_API_URL = 'https://payment.rupantorpay.com/api/payment/checkout';
const SANDBOX_API_URL = 'https://sandbox.rupantorpay.com/api/payment/checkout'; // This is a guess. Please confirm with RupantorPay.
const VERIFY_API_URL_LIVE = 'https://payment.rupantorpay.com/api/payment/verify';
const VERIFY_API_URL_SANDBOX = 'https://sandbox.rupantorpay.com/api/payment/verify'; // This is a guess.

class RupantorPayService implements PaymentService {
  async initiatePayment(
    order: Omit<Order, 'id' | 'status'> & { id: string },
    userEmail: string,
    gateway: Gateway
  ): Promise<PaymentInitiationResponse> {
    const apiUrl = gateway.isLive ? LIVE_API_URL : SANDBOX_API_URL;
    console.log(`RupantorPay: Using API URL: ${apiUrl}`);

    const payload = {
      amount: order.amount,
      fullname: userEmail.split('@')[0], // Using email part as a fallback for name
      email: userEmail,
      tran_id: order.id,
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/fail`,
      webhook_url: `${process.env.CLIENT_URL}/api/payment/ipn`,
      product_name: order.description,
      product_category: 'Digital Goods',
    };
    
    console.log('RupantorPay: Initiating payment with payload:', payload);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': gateway.storePassword, // Your Store Password/Secret
          'X-CLIENT': gateway.storeId,       // Your Store ID
        },
        body: JSON.stringify(payload),
      });

      const responseBodyText = await response.text();
      console.log(`RupantorPay: API response status: ${response.status}`, `Response Body: ${responseBodyText}`);

      if (!response.ok) {
        return { success: false, message: `Failed to connect to RupantorPay. Status: ${response.status}. ${responseBodyText}` };
      }

      const apiResponse = JSON.parse(responseBodyText);

      if (apiResponse && apiResponse.payment_url) {
        console.log('RupantorPay: Successfully received payment_url.');
        return { success: true, url: apiResponse.payment_url };
      } else {
        const errorMessage = apiResponse.message || 'Failed to get payment URL from RupantorPay.';
        console.error("RupantorPay: API Error:", errorMessage, apiResponse);
        return { success: false, message: errorMessage };
      }

    } catch (error) {
      console.error("RupantorPay: Initiation error:", error);
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
    const tran_id = body.tran_id as string;
    console.log(`RupantorPay: Received IPN for tran_id: ${tran_id}`, body);

    if (!tran_id) {
        console.error('RupantorPay: IPN validation failed - no transaction ID found.');
        return { isValid: false, transactionId: 'unknown', status: 'FAILED', paymentDetails: body };
    }

    const verifyUrl = gateway.isLive ? VERIFY_API_URL_LIVE : VERIFY_API_URL_SANDBOX;

    try {
        console.log(`RupantorPay: Verifying transaction ${tran_id} at ${verifyUrl}`);
        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': gateway.storePassword,
                'X-CLIENT': gateway.storeId,
            },
            body: JSON.stringify({ tran_id: tran_id }),
        });

        const verificationResult = await response.json();
        console.log('RupantorPay: Verification API response:', verificationResult);

        // Assuming the verification response has a 'status' field.
        // The value 'COMPLETED' is a guess. Please confirm with RupantorPay docs.
        const isPaymentSuccess = verificationResult.status === 'COMPLETED';

        return {
            isValid: isPaymentSuccess,
            transactionId: tran_id,
            status: isPaymentSuccess ? 'COMPLETED' : 'FAILED',
            paymentDetails: verificationResult, // Store the verified details
        };

    } catch (error) {
       console.error(`RupantorPay: IPN validation API call failed for tran_id ${tran_id}:`, error);
       return {
         isValid: false,
         transactionId: tran_id,
         status: 'FAILED',
         paymentDetails: body,
       };
    }
  }
}

export const rupantorPayService = new RupantorPayService();
