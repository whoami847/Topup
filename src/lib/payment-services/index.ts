
import type { Gateway } from '../gateways';
import { sslCommerzService } from './sslcommerz';
import { rupantorPayService } from './rupantorpay';
import type { PaymentService } from './types';

/**
 * A factory function to get the correct payment service based on the gateway name.
 * The gateway name should be a simple, lowercase identifier.
 */
export function getPaymentService(gateway: Gateway): PaymentService | null {
  const gatewayName = gateway.name.toLowerCase();

  if (gatewayName.includes('sslcommerz')) {
    return sslCommerzService;
  }
  
  if (gatewayName.includes('rupantorpay')) {
    // NOTE: This service is a placeholder and needs to be implemented.
    return rupantorPayService;
  }
  
  // Add other gateways here
  // if (gatewayName.includes('aamarpay')) {
  //   return aamarPayService;
  // }

  console.error(`No payment service found for gateway: ${gateway.name}`);
  return null;
}
