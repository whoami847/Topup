
import type { Gateway } from '../gateways';
import type { Order } from '../store';
import type {
  PaymentService,
  PaymentInitiationResponse,
  PaymentValidationResponse,
} from './types';
import type { NextRequest } from 'next/server';

// API Endpoints provided by the user.
const LIVE_API_URL = 'https://payment.rupantorpay.com/api/payment/checkout';
const SANDBOX_API_URL = 'https://sandbox.rupantorpay.com/api/payment/checkout';
const VERIFY_API_URL_LIVE = 'https://payment.rupantorpay.com/api/payment/verify';
const VERIFY_API_URL_SANDBOX = 'https://sandbox.rupantorpay.com/api/payment/verify';

class RupantorPayService implements PaymentService {
  async initiatePayment(
    order: Omit<Order, 'id' | 'status'> & { id: string },
    userEmail: string,
    gateway: Gateway,
    baseUrl: string,
    req: NextRequest
  ): Promise<PaymentInitiationResponse> {
    const apiUrl = gateway.isLive ? LIVE_API_URL : SANDBOX_API_URL;
    console.log(`RupantorPay Service: Using API URL: ${apiUrl}`);

    const payload = {
      amount: order.amount,
      fullname: userEmail.split('@')[0],
      email: userEmail,
      tran_id: order.id,
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/fail`,
      webhook_url: `${baseUrl}/api/payment/ipn`,
      product_name: order.description,
      product_category: 'Digital Goods',
    };
    
    console.log('RupantorPay Service: Payload being sent:', payload);

    try {
      const clientHost = req.headers.get('host') || 'localhost';

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': gateway.storePassword,
        'X-CLIENT': clientHost,
      };

      console.log('RupantorPay Service: Headers being sent (X-API-KEY is masked):', { ...headers, 'X-API-KEY': '********' });

      console.log('RupantorPay Service: Making fetch request to API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const responseBodyText = await response.text();
      console.log(`RupantorPay Service: API Response Status: ${response.status}`);
      console.log(`RupantorPay Service: API Raw Response Body: ${responseBodyText}`);

      if (!response.ok) {
        console.error('RupantorPay Service: API request failed.');
        return { success: false, message: `Failed to connect to RupantorPay. Status: ${response.status}. ${responseBodyText}` };
      }

      const apiResponse = JSON.parse(responseBodyText);

      if (apiResponse && apiResponse.payment_url) {
        console.log('RupantorPay Service: Successfully received payment_url.');
        return { success: true, url: apiResponse.payment_url };
      } else {
        const errorMessage = apiResponse.message || 'Failed to get payment URL from RupantorPay.';
        console.error("RupantorPay Service: API Error - payment_url not found.", errorMessage, apiResponse);
        return { success: false, message: errorMessage };
      }

    } catch (error) {
      console.error("RupantorPay Service: An exception occurred during payment initiation:", error);
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
        
        const isPaymentSuccess = verificationResult.status === 'COMPLETED';

        return {
            isValid: isPaymentSuccess,
            transactionId: tran_id,
            status: isPaymentSuccess ? 'COMPLETED' : 'FAILED',
            paymentDetails: verificationResult,
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
