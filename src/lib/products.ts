export type Product = {
  id: string;
  name: string;
  price: number;
  icon?: string;
};

export type FormFieldType =
  | 'player_id'
  | 'email'
  | 'account_type'
  | 'email_phone'
  | 'password'
  | 'two_step_code'
  | 'quantity';

export type TopUpCategory = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  pageTitle: string;
  products: Product[];
  formFields: FormFieldType[];
  description: string[];
};

export type MainCategory = {
  id: string;
  title: string;
  imageHint: string;
  imageUrl: string;
  subCategorySlugs: string[];
};
