
// This file is a placeholder for potential SSLCommerz integration in the future.
// The current focus is on RupantorPay.

import type { Gateway } from '../gateways';
import type { Order } from '../store';
import type {
  PaymentService,
  PaymentInitiationResponse,
  PaymentValidationResponse,
} from './types';

class SSLCommerzService implements PaymentService {
  async initiatePayment(
    order: Omit<Order, 'id' | 'status'> & { id: string },
    userEmail: string,
    gateway: Gateway,
    baseUrl: string
  ): Promise<PaymentInitiationResponse> {
    console.log("SSLCommerz service is not fully implemented yet.");
    return Promise.resolve({ success: false, message: 'SSLCommerz is not configured.' });
  }

  async validateIPN(
    body: any,
    gateway: Gateway
  ): Promise<PaymentValidationResponse> {
    console.log("SSLCommerz service is not fully implemented yet.");
    return Promise.resolve({ isValid: false, transactionId: body.tran_id, status: 'FAILED', paymentDetails: body });
  }
}

export const sslCommerzService = new SSLCommerzService();
