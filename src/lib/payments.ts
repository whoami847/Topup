
export type PaymentMethod = {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'Personal' | 'Agent';
  logoUrl: string;
  imageHint: string;
  enabled: boolean;
};
