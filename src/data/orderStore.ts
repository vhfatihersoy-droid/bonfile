import { OrderReceipt, Coupon, Product } from '../types';
import { products as defaultProducts } from './mockData';

const ORDERS_STORAGE_KEY = 'efecioglu_orders_v1';
const PRODUCTS_STORAGE_KEY = 'efecioglu_products_v1';
const COUPONS_STORAGE_KEY = 'efecioglu_coupons_v1';

export const defaultCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'EFECIOGLU10',
    discountPercent: 10,
    minSpend: 1000,
    description: '1.000 TL üzeri tüm siparişlerde %10 Hoş Geldin İndirimi',
    isActive: true,
    usedCount: 42,
  },
  {
    id: 'c2',
    code: 'GURME100',
    discountAmount: 100,
    minSpend: 1500,
    description: '1.500 TL üzeri gurme et alışverişlerinde 100 TL anında indirim',
    isActive: true,
    usedCount: 28,
  },
  {
    id: 'c3',
    code: 'STEAK15',
    discountPercent: 15,
    minSpend: 2000,
    description: 'Dry-Aged ve Özel Steak kesimlerinde %15 indirim',
    isActive: true,
    usedCount: 15,
  },
];

export const defaultOrders: OrderReceipt[] = [
  {
    orderId: 'EFC-984201',
    createdAt: 'Bugün, 13:45',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderStatus: 'in_transit',
    customerName: 'Av. Mehmet Can Kaya',
    customerPhone: '0532 890 12 34',
    customerAddress: 'Teşvikiye Mah. Valikonağı Cad. No:44 D:6 Nişantaşı / Şişli / İstanbul',
    deliveryMethod: 'same-day',
    items: [
      {
        product: defaultProducts[0], // Bonfile
        selectedWeight: { label: '1000g (Bütün/Dilimli)', grams: 1000, multiplier: 1.95 },
        quantity: 1,
      },
      {
        product: defaultProducts[1], // Dallas Steak
        selectedWeight: { label: '500g (1 Kalın Dilim)', grams: 500, multiplier: 1 },
        quantity: 2,
      },
    ],
    subtotal: 2369,
    shippingCost: 0,
    discountAmount: 100,
    couponCode: 'GURME100',
    grandTotal: 2269,
    installment: 1,
    notes: 'Lütfen bonfileyi 4 eşit lokum dilim olarak vakumlayınız. Kapıda zile basılmadan aransın.',
    courierName: 'Efecioğlu Frigo Araç #04 (Ahmet Usta)',
    courierPhone: '0533 111 22 33',
  },
  {
    orderId: 'EFC-984202',
    createdAt: 'Bugün, 12:15',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending_cod',
    orderStatus: 'preparing',
    customerName: 'Zeynep & Bora Arslan',
    customerPhone: '0535 777 88 99',
    customerAddress: 'Caddebostan Mah. Bağdat Cad. Palmiye Apt. No:288 Kadıköy / İstanbul',
    deliveryMethod: 'same-day',
    items: [
      {
        product: defaultProducts[2] || defaultProducts[0],
        selectedWeight: { label: '500g', grams: 500, multiplier: 1 },
        quantity: 2,
      },
    ],
    subtotal: 1160,
    shippingCost: 0,
    grandTotal: 1160,
    notes: 'Temassız POS ile kapıda kredi kartı çekimi yapılacak.',
  },
  {
    orderId: 'EFC-984189',
    createdAt: 'Dün, 16:30',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customerName: 'Dr. Serdar Özkan',
    customerPhone: '0542 333 44 55',
    customerAddress: 'Tarabya Mah. Çamlık Sitesi B Blok No:12 Sarıyer / İstanbul',
    deliveryMethod: 'same-day',
    items: [
      {
        product: defaultProducts[1] || defaultProducts[0],
        selectedWeight: { label: '1000g (2 Dilim)', grams: 1000, multiplier: 1.95 },
        quantity: 2,
      },
    ],
    subtotal: 2262,
    shippingCost: 0,
    grandTotal: 2262,
    notes: 'Dekont kontrol edildi ve onaylandı. Teslim alındı.',
  },
  {
    orderId: 'EFC-984175',
    createdAt: '20 Ekim 2026, 11:20',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customerName: 'Burak Demir',
    customerPhone: '0555 999 00 11',
    customerAddress: 'Acıbadem Mah. Çeçen Sok. Akasya Kule No:4 Üsküdar / İstanbul',
    deliveryMethod: 'same-day',
    items: [
      {
        product: defaultProducts[0],
        selectedWeight: { label: '500g', grams: 500, multiplier: 1 },
        quantity: 1,
      },
    ],
    subtotal: 620,
    shippingCost: 95,
    grandTotal: 715,
  },
];

export const getStoredOrders = (): OrderReceipt[] => {
  if (typeof window === 'undefined') return defaultOrders;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(defaultOrders));
      return defaultOrders;
    }
    return JSON.parse(raw);
  } catch {
    return defaultOrders;
  }
};

export const saveStoredOrders = (orders: OrderReceipt[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
};

export const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(raw);
  } catch {
    return defaultProducts;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
};

export const getStoredCoupons = (): Coupon[] => {
  if (typeof window === 'undefined') return defaultCoupons;
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(defaultCoupons));
      return defaultCoupons;
    }
    return JSON.parse(raw);
  } catch {
    return defaultCoupons;
  }
};

export const saveStoredCoupons = (coupons: Coupon[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Failed to save coupons to localStorage', e);
  }
};
