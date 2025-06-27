
import type { Gateway } from '@/lib/gateways';
import type { Order } from '@/lib/store';

/**
 * The response from a payment initiation request.
 */
export interface PaymentInitiationResponse {
  success: boolean;
  /** The URL to redirect the user to for payment. */
  url?: string;
  /** A message to display to the user, especially on failure. */
  message?: string;
}

/**
 * The response from validating an IPN (Instant Payment Notification).
 */
export interface PaymentValidationResponse {
  /** Whether the IPN is valid and the payment is confirmed. */
  isValid: boolean;
  /** The transaction ID from the payment gateway. */
  transactionId: string;
  /** The final status of the transaction. */
  status: 'COMPLETED' | 'FAILED';
  /** The full payload from the IPN for logging/debugging. */
  paymentDetails: any;
}

/**
 * Defines the contract for any payment service integration.
 */
export interface PaymentService {
  /**
   * Initiates a payment and returns a URL to redirect the user to.
   */
  initiatePayment: (
    order: Omit<Order, 'id' | 'status'> & { id: string }, // The order object with a generated tran_id
    userEmail: string,
    gateway: Gateway,
    baseUrl: string
  ) => Promise<PaymentInitiationResponse>;

  /**
   * Validates an IPN from the payment gateway to confirm the payment.
   */
  validateIPN: (
    body: any,
    gateway: Gateway
  ) => Promise<PaymentValidationResponse>;
}
