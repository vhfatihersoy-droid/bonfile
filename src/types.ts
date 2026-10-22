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
  marinade?: string;
  sliceThickness?: string;
  packaging?: string;
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

export interface PaymentSettings {
  mode: 'test' | 'live';
  provider: 'paytr' | 'iyzico' | 'param' | 'bank_pos';
  // PayTR
  paytrMerchantId?: string;
  paytrMerchantKey?: string;
  paytrMerchantSalt?: string;
  // iyzico
  iyzicoApiKey?: string;
  iyzicoSecretKey?: string;
  // Bank Account for Havale
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  // Payment methods toggle
  enableCreditCard?: boolean;
  enableCashOnDelivery?: boolean;
  enableBankTransfer?: boolean;
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
  paymentSettings?: PaymentSettings;
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

export type OrderStatus = 'pending' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled';

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number; // e.g. 10 for 10%
  discountAmount?: number; // e.g. 100 for 100 TL
  minSpend?: number;
  description: string;
  isActive: boolean;
  usedCount: number;
}

export interface OrderReceipt {
  orderId: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_cod' | 'pending_transfer';
  orderStatus: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryMethod: 'same-day' | 'termobox-cargo';
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  couponCode?: string;
  grandTotal: number;
  installment?: number;
  notes?: string;
  courierName?: string;
  courierPhone?: string;
}

