import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Snowflake,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck,
  Lock,
  Printer,
  ChevronLeft,
  Truck,
  Check,
} from 'lucide-react';
import { CartItem, SiteConfig, PaymentMethod, CardPaymentData, OrderReceipt } from '../types';
import { MeatVisual } from './MeatVisual';
import { ThreeDSecureModal } from './Payment/ThreeDSecureModal';
import { BankTransferInfo } from './Payment/BankTransferInfo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, weightGrams: number, delta: number) => void;
  onRemoveItem: (productId: string, weightGrams: number) => void;
  onClearCart: () => void;
  config: SiteConfig;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
}) => {
  if (!isOpen) return null;

  // Multi-step checkout states
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');

  // Customer & Delivery Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'same-day' | 'termobox-cargo'>('same-day');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [codType, setCodType] = useState<'pos' | 'cash'>('pos');

  // Card details
  const [cardData, setCardData] = useState<CardPaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvc: '',
    installment: 1,
  });

  // 3D Secure modal control
  const [is3DSecureOpen, setIs3DSecureOpen] = useState(false);
  const [cardError, setCardError] = useState('');

  // Generated receipt
  const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);

  // Financial calculations
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Math.round(item.product.basePrice * item.selectedWeight.multiplier);
    return acc + itemPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal >= config.freeShippingThreshold || subtotal === 0 ? 0 : 95;
  const grandTotal = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, config.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / config.freeShippingThreshold) * 100));

  // Auto-detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('9792')) return 'Troy';
    return null;
  };

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardData({ ...cardData, expiry: raw });
  };

  // Move from Shipping to Payment step
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;
    setStep('payment');
  };

  // Trigger Payment
  const handlePayButtonClick = () => {
    if (paymentMethod === 'credit_card') {
      const cleanNum = cardData.cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 16) {
        setCardError('Lütfen 16 haneli kart numaranızı eksiksiz giriniz.');
        return;
      }
      if (!cardData.cardHolder.trim()) {
        setCardError('Lütfen kart üzerindeki ad soyad bilgisini giriniz.');
        return;
      }
      if (cardData.expiry.length < 5) {
        setCardError('Lütfen son kullanma tarihini (AA/YY) giriniz.');
        return;
      }
      if (cardData.cvc.length < 3) {
        setCardError('Lütfen 3 haneli güvenlik kodunu (CVC) giriniz.');
        return;
      }

      setCardError('');
      // Open official 3D Secure modal
      setIs3DSecureOpen(true);
    } else {
      // For COD or Bank Transfer, finalize directly
      finalizeOrder(
        paymentMethod === 'cash_on_delivery' ? 'pending_cod' : 'pending_transfer'
      );
    }
  };

  // Finalize order after payment success
  const finalizeOrder = (paymentStatus: OrderReceipt['paymentStatus']) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newReceipt: OrderReceipt = {
      orderId: `BON-${randomNum}`,
      createdAt: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      paymentMethod,
      paymentStatus,
      customerName,
      customerPhone,
      customerAddress,
      deliveryMethod,
      items: [...items],
      subtotal,
      shippingCost,
      grandTotal,
      installment: cardData.installment,
    };

    setOrderReceipt(newReceipt);
    setIs3DSecureOpen(false);
    setStep('success');
    onClearCart();
  };

  // Quick autofill demo test card
  const fillTestCard = () => {
    setCardData({
      cardNumber: '5428 1234 5678 1905',
      cardHolder: customerName || 'FATİH ERSOY',
      expiry: '12/28',
      cvc: '356',
      installment: 1,
    });
    setCardError('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
          <div className="w-screen max-w-lg bg-neutral-950 border-l border-neutral-800 text-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center gap-2">
                {step !== 'cart' && step !== 'success' && (
                  <button
                    onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer mr-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  {step === 'cart'
                    ? 'Alışveriş Sepeti'
                    : step === 'shipping'
                    ? 'Teslimat & Kurye Bilgileri'
                    : step === 'payment'
                    ? 'Güvenli Ödeme'
                    : 'Sipariş Onayı'}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress bar (shown during checkout) */}
            {step !== 'success' && (
              <div className="px-6 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                <span className={step === 'cart' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                  1. Sepet ({items.length})
                </span>
                <span>→</span>
                <span className={step === 'shipping' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                  2. Teslimat
                </span>
                <span>→</span>
                <span className={step === 'payment' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                  3. Ödeme
                </span>
              </div>
            )}

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* STEP 1: CART ITEMS */}
              {step === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto" />
                      <h4 className="text-base font-bold text-neutral-300">Sepetiniz Boş</h4>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                        Lezzetli dry-aged steakler, köfteler ve şarküteri ürünlerimizi inceleyip sepetinize ekleyebilirsiniz.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-2 px-5 py-2 text-xs font-semibold bg-red-700 text-white rounded-md hover:bg-red-800 cursor-pointer"
                      >
                        Ürünleri İncele
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Cold Chain Free Shipping Progress Indicator */}
                      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                            <Snowflake className="w-3.5 h-3.5" />
                            <span>Soğuk Zincir Frigorifik Teslimat</span>
                          </span>
                          <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                            {remainingForFreeShipping === 0 ? (
                              <span className="text-emerald-400 font-bold">Kargo Ücretsiz!</span>
                            ) : (
                              `${remainingForFreeShipping.toLocaleString('tr-TR')} TL Kaldı`
                            )}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-amber-400 transition-all duration-300"
                            style={{ width: `${freeShippingProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="divide-y divide-neutral-800">
                        {items.map((item) => {
                          const itemUnitPrice = Math.round(item.product.basePrice * item.selectedWeight.multiplier);
                          const itemTotalPrice = itemUnitPrice * item.quantity;

                          return (
                            <div key={`${item.product.id}-${item.selectedWeight.grams}`} className="py-4 flex gap-3">
                              <div className="w-16 h-16 rounded overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                                <MeatVisual
                                  slug={item.product.slug}
                                  name={item.product.name}
                                  category={item.product.category}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-start justify-between gap-1">
                                    <h5 className="text-xs font-bold text-white truncate">
                                      {item.product.name}
                                    </h5>
                                    <button
                                      onClick={() => onRemoveItem(item.product.id, item.selectedWeight.grams)}
                                      className="text-neutral-500 hover:text-red-400 p-0.5 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <span className="text-[11px] text-amber-400 block font-medium">
                                    {item.selectedWeight.label}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border border-neutral-700 rounded bg-neutral-900">
                                    <button
                                      onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight.grams, -1)}
                                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2 text-xs font-mono font-bold text-white tabular-nums">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight.grams, 1)}
                                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                                    {itemTotalPrice.toLocaleString('tr-TR')} TL
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: SHIPPING / DELIVERY FORM */}
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs">
                  <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-white font-bold block mb-1">Teslimat & İletişim Bilgileri</span>
                    <p className="text-[11px] text-neutral-400">
                      Soğuk zincir kuryemizin size ulaşabilmesi için bilgileri giriniz.
                    </p>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Örn: Fatih Ersoy"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Telefon Numarası *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0532 xxx xx xx"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Teslimat Adresi *</label>
                    <textarea
                      rows={3}
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Mahalle, cadde, sokak, bina ve daire no..."
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-neutral-300 font-medium">Teslimat Yöntemi:</label>
                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'same-day'}
                        onChange={() => setDeliveryMethod('same-day')}
                      />
                      <div>
                        <span className="font-semibold text-white block">İstanbul İçi Aynı Gün Frigorifik Kurye</span>
                        <span className="text-[10px] text-neutral-400">Özel 0°C - +4°C soğutuculu araçla kapınıza teslim</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'termobox-cargo'}
                        onChange={() => setDeliveryMethod('termobox-cargo')}
                      />
                      <div>
                        <span className="font-semibold text-white block">Tüm Türkiye Termobox Kuru Buzlu Kargo</span>
                        <span className="text-[10px] text-neutral-400">48 saat ısı korumalı özel strafor kutuda ambalajlı</span>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-md transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Ödeme Adımına Geç</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 3: PAYMENT METHOD & FORM */}
              {step === 'payment' && (
                <div className="space-y-5 text-xs">
                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'credit_card'
                          ? 'border-amber-400 bg-neutral-900 text-white font-bold shadow-md'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px]">3D Kredi Kartı</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-amber-400 bg-neutral-900 text-white font-bold shadow-md'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px]">Kapıda Ödeme</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-amber-400 bg-neutral-900 text-white font-bold shadow-md'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-sky-400" />
                      <span className="text-[11px]">Havale / EFT</span>
                    </button>
                  </div>

                  {/* 1. CREDIT CARD FORM WITH LIVE VISUAL */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      {/* Stylized Dynamic Credit Card Mockup */}
                      <div className="relative rounded-xl p-5 bg-gradient-to-tr from-neutral-900 via-red-950 to-neutral-900 border border-neutral-700 shadow-xl text-white space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                            {config.brandName} GÜVENLİ POS
                          </span>
                          <span className="text-xs font-bold text-neutral-300 font-mono">
                            {getCardBrand(cardData.cardNumber) || '3D SECURE'}
                          </span>
                        </div>

                        {/* Card Number Display */}
                        <div className="font-mono text-base tracking-widest text-white tabular-nums py-1">
                          {cardData.cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-[9px] text-neutral-400 uppercase block">KART SAHİBİ</span>
                            <span className="font-semibold uppercase tracking-wide">
                              {cardData.cardHolder || customerName || 'AD SOYAD'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] text-neutral-400 uppercase block">SON KULLANMA</span>
                            <span className="font-mono font-semibold tabular-nums">
                              {cardData.expiry || 'AA/YY'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Autofill Demo Card Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={fillTestCard}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                        >
                          Örnek Test Kartı Bilgilerini Doldur
                        </button>
                      </div>

                      {/* Card Inputs */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-neutral-300 font-medium mb-1">Kart Numarası *</label>
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="5428 1234 5678 1905"
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white font-mono focus:outline-none focus:border-amber-400 tracking-wider"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-medium mb-1">Kart Üzerindeki İsim *</label>
                          <input
                            type="text"
                            value={cardData.cardHolder}
                            onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                            placeholder="FATİH ERSOY"
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-amber-400 uppercase font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-300 font-medium mb-1">Son Kullanma *</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardData.expiry}
                              onChange={handleExpiryChange}
                              placeholder="AA/YY"
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white font-mono text-center focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-300 font-medium mb-1">CVC / Güvenlik *</label>
                            <input
                              type="text"
                              maxLength={3}
                              value={cardData.cvc}
                              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/[^0-9]/g, '') })}
                              placeholder="123"
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white font-mono text-center focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        {/* Installment Options */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-neutral-300 font-medium">Taksit Seçenekleri:</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { count: 1, label: 'Tek Çekim', perMonth: grandTotal },
                              { count: 3, label: '3 Taksit', perMonth: Math.round(grandTotal / 3) },
                              { count: 6, label: '6 Taksit', perMonth: Math.round((grandTotal * 1.04) / 6) },
                            ].map((inst) => (
                              <button
                                key={inst.count}
                                type="button"
                                onClick={() => setCardData({ ...cardData, installment: inst.count })}
                                className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                                  cardData.installment === inst.count
                                    ? 'bg-neutral-800 border-amber-400 text-white font-bold'
                                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                <span className="block text-[11px]">{inst.label}</span>
                                <span className="text-[10px] text-amber-400 font-mono tabular-nums">
                                  {inst.perMonth.toLocaleString('tr-TR')} TL/Ay
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {cardError && (
                          <div className="p-2.5 bg-red-950/60 border border-red-800 text-red-300 rounded text-[11px]">
                            {cardError}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. CASH ON DELIVERY (KAPIDA ÖDEME) */}
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
                        <span className="font-bold text-white block">Kapıda Ödeme Şekli:</span>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2.5 p-2.5 rounded bg-neutral-950 border border-neutral-800 cursor-pointer">
                            <input
                              type="radio"
                              name="codType"
                              checked={codType === 'pos'}
                              onChange={() => setCodType('pos')}
                            />
                            <div>
                              <span className="font-semibold text-white block">Kapıda Kredi Kartı (Mobil POS)</span>
                              <span className="text-[10px] text-neutral-400">Temassız veya şifreli mobil pos ile ödeme</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 rounded bg-neutral-950 border border-neutral-800 cursor-pointer">
                            <input
                              type="radio"
                              name="codType"
                              checked={codType === 'cash'}
                              onChange={() => setCodType('cash')}
                            />
                            <div>
                              <span className="font-semibold text-white block">Kapıda Nakit Ödeme</span>
                              <span className="text-[10px] text-neutral-400">Kuryemize tam tutar nakit ödeme</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-900/50 rounded border border-neutral-800 text-neutral-400 text-[11px]">
                        Frigorifik teslimat kuryemiz gelmeden önce 30 dakika önceden sizi telefonla arayacaktır.
                      </div>
                    </div>
                  )}

                  {/* 3. BANK TRANSFER / EFT */}
                  {paymentMethod === 'bank_transfer' && (
                    <BankTransferInfo orderId="BON-SİPARİŞ" totalAmount={grandTotal} />
                  )}

                  {/* Total & Action Button */}
                  <div className="pt-3 border-t border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Ödenecek Toplam Tutar:</span>
                      <span className="text-base font-black text-amber-400 font-mono tabular-nums">
                        {grandTotal.toLocaleString('tr-TR')} TL
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handlePayButtonClick}
                      className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-md shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {paymentMethod === 'credit_card' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>3D Secure ile Güvenli Öde ({grandTotal.toLocaleString('tr-TR')} TL)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Siparişi Onayla ({grandTotal.toLocaleString('tr-TR')} TL)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS / ORDER CONFIRMATION & RECEIPT */}
              {step === 'success' && orderReceipt && (
                <div className="space-y-6 text-xs animate-in fade-in">
                  <div className="text-center py-4 space-y-2">
                    <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-600/50 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Siparişiniz Başarıyla Alındı!</h4>
                    <p className="text-neutral-400 text-[11px]">
                      Siparişiniz hazırlanmak üzere frigorifik kesim ve paketleme birimine iletildi.
                    </p>
                  </div>

                  {/* Receipt Card */}
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">SİPARİŞ NO</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {orderReceipt.orderId}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">DURUM</span>
                        <span className="font-semibold text-emerald-400 text-xs">
                          {orderReceipt.paymentStatus === 'paid'
                            ? 'Ödendi (3D Secure)'
                            : orderReceipt.paymentStatus === 'pending_cod'
                            ? 'Kapıda Tahsil Edilecek'
                            : 'Havale Bekleniyor'}
                        </span>
                      </div>
                    </div>

                    {/* Delivery & Customer Info */}
                    <div className="space-y-1.5 text-neutral-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Müşteri:</span>
                        <span className="font-medium text-white">{orderReceipt.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Telefon:</span>
                        <span className="font-mono text-white">{orderReceipt.customerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Teslimat Adresi:</span>
                        <span className="font-medium text-white text-right max-w-[200px] truncate">
                          {orderReceipt.customerAddress}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Teslimat Şekli:</span>
                        <span className="font-medium text-sky-400">
                          {orderReceipt.deliveryMethod === 'same-day' ? 'Frigorifik Özel Kurye' : 'Termobox Kargo'}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="border-t border-neutral-800 pt-3 space-y-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Sipariş Kalemleri ({orderReceipt.items.length})
                      </span>
                      {orderReceipt.items.map((item, idx) => {
                        const price = Math.round(item.product.basePrice * item.selectedWeight.multiplier) * item.quantity;
                        return (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span className="text-neutral-300">
                              {item.quantity}x {item.product.name} ({item.selectedWeight.label})
                            </span>
                            <span className="font-mono text-white tabular-nums">
                              {price.toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-neutral-800 pt-3 space-y-1">
                      <div className="flex justify-between text-neutral-400">
                        <span>Ara Toplam:</span>
                        <span className="font-mono text-white">{orderReceipt.subtotal.toLocaleString('tr-TR')} TL</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Soğuk Zincir Kargo:</span>
                        <span className="font-mono text-white">
                          {orderReceipt.shippingCost === 0 ? 'ÜCRETSİZ' : `${orderReceipt.shippingCost} TL`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-neutral-800">
                        <span>Toplam:</span>
                        <span className="font-mono text-amber-400 text-base tabular-nums">
                          {orderReceipt.grandTotal.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Print / Action buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Faturayı Yazdır</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('cart');
                        onClose();
                      }}
                      className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Alışverişe Devam Et
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart step footer */}
            {step === 'cart' && items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Ara Toplam:</span>
                    <span className="font-mono text-white tabular-nums">{subtotal.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Soğuk Zincir Frigorifik Kargo:</span>
                    <span className="font-mono text-white tabular-nums">
                      {shippingCost === 0 ? <span className="text-emerald-400 font-semibold">ÜCRETSİZ</span> : `${shippingCost} TL`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-neutral-800 pt-2">
                    <span>Genel Toplam:</span>
                    <span className="font-mono text-amber-400 text-base tabular-nums">
                      {grandTotal.toLocaleString('tr-TR')} TL
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-md text-xs cursor-pointer shadow-md transition-colors"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Secure SMS Verification Modal */}
      <ThreeDSecureModal
        isOpen={is3DSecureOpen}
        onClose={() => setIs3DSecureOpen(false)}
        onSuccess={() => finalizeOrder('paid')}
        amount={grandTotal}
        cardNumber={cardData.cardNumber}
        cardHolder={cardData.cardHolder || customerName}
      />
    </>
  );
};
