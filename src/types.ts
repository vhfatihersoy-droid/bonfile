export type MeatCategory = 
  | 'all'
  | 'steak'
  | 'beef'
  | 'lamb'
  | 'meatball'
  | 'charcuterie'
  | 'doner'
  | 'horeca';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: MeatCategory;
  categoryName: string;
  tagline: string;
  description: string;
  basePrice: number; // TL per standard weight
  unitWeight: string; // e.g. "500g"
  weights: { label: string; grams: number; multiplier: number }[];
  cutLocation: string; // e.g. "Dana Sırt (Loin)", "Dana But", "Kuzu Kaburga"
  agingDays?: number; // e.g. 28 days dry-aged
  fatRatio: string; // e.g. "%8 - %12 Yağ"
  cookingMethods: ('Tava' | 'Izgara' | 'Fırın' | 'Tencere' | 'Fümeli')[];
  cookingTimeMinutes: number;
  origin: string;
  badge?: string;
  inStock: boolean;
  nutritionPer100g: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  chefAdvice: string;
  accentColor: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  selectedWeight: { label: string; grams: number; multiplier: number };
  quantity: number;
}

export interface Recipe {
  id: string;
  title: string;
  meatType: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Kolay' | 'Orta' | 'Usta İşi';
  servings: number;
  ingredients: string[];
  steps: string[];
  chefTip: string;
}

export interface SiteConfig {
  brandName: string;
  establishedYear: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  freeShippingThreshold: number;
  colorTheme: 'dark-gourmet' | 'classic-butcher' | 'warm-amber';
}

export type PaymentMethod = 'credit_card' | 'cash_on_delivery' | 'bank_transfer';

export interface CardPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
  installment: number; // 1 = tek çekim, 3, 6
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
  branch: string;
}

export interface OrderReceipt {
  orderId: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_cod' | 'pending_transfer';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryMethod: 'same-day' | 'termobox-cargo';
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  installment?: number;
}
