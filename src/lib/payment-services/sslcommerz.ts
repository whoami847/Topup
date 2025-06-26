
import SSLCommerz from 'sslcommerz-lts';
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
    gateway: Gateway
  ): Promise<PaymentInitiationResponse> {
    const data = {
      total_amount: order.amount,
      currency: 'BDT',
      tran_id: order.id,
      success_url: `${process.env.CLIENT_URL}/api/payment/success/${order.id}`,
      fail_url: `${process.env.CLIENT_URL}/api/payment/fail/${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/api/payment/cancel/${order.id}`,
      ipn_url: `${process.env.CLIENT_URL}/api/payment/ipn`,
      shipping_method: 'No',
      product_name: order.description,
      product_category: 'Digital Goods',
      product_profile: 'digital-goods',
      cus_name: userEmail,
      cus_email: userEmail,
      cus_add1: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'Bangladesh',
      cus_phone: 'N/A',
    };

    const sslcz = new SSLCommerz(
      gateway.storeId,
      gateway.storePassword,
      gateway.isLive
    );
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status === 'SUCCESS') {
      return { success: true, url: apiResponse.GatewayPageURL };
    } else {
      return {
        success: false,
        message: 'SSLCommerz initialization failed.',
      };
    }
  }

  async validateIPN(
    body: any,
    gateway: Gateway
  ): Promise<PaymentValidationResponse> {
    const sslcz = new SSLCommerz(
      gateway.storeId,
      gateway.storePassword,
      gateway.isLive
    );
    const isValid = await sslcz.validate(body);

    return {
      isValid,
      transactionId: body.tran_id,
      status: isValid ? 'COMPLETED' : 'FAILED',
      paymentDetails: body,
    };
  }
}

export const sslCommerzService = new SSLCommerzService();
