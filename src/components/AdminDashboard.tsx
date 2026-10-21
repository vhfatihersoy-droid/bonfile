import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Search,
  TrendingUp,
  Printer,
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
  Phone,
  MapPin,
  ExternalLink,
  DollarSign,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { Product, OrderReceipt, Coupon, SiteConfig, OrderStatus, MeatCategory } from '../types';
import { categories as defaultCategories } from '../data/mockData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: OrderReceipt[];
  onUpdateOrders: (orders: OrderReceipt[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  config: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrders,
  coupons,
  onUpdateCoupons,
  config,
  onUpdateConfig,
}) => {
  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default unlocked for convenience, with lock option
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'settings'>('overview');

  // Search & Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Selected Order for Receipt / Waybill modal
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<OrderReceipt | null>(null);

  // Product Add / Edit modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    category: 'steak',
    categoryName: 'Steakhouse Kesimleri',
    tagline: '',
    description: '',
    basePrice: 550,
    unitWeight: '500g',
    cutLocation: 'Dana Sırt',
    agingDays: 21,
    fatRatio: '%12 - %15',
    cookingMethods: ['Izgara', 'Tava'],
    cookingTimeMinutes: 6,
    origin: 'Balıkesir Besi Çiftliği',
    inStock: true,
    badge: 'Yeni',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
    accentColor: '#B91C1C',
    nutritionPer100g: { calories: 180, protein: 22, fat: 10, carbs: 0 },
    chefAdvice: 'Oda sıcaklığında 20 dakika beklettikten sonra mühürleyin.',
  });

  // Coupon Add state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState<number>(1000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  if (!isOpen) return null;

  // Handle PIN Unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1984' || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // Financial Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.grandTotal : 0), 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => o.orderStatus === 'preparing' || o.orderStatus === 'in_transit').length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  // Status badge styling helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Beklemede', bg: 'bg-amber-950 text-amber-400 border-amber-800', icon: Clock };
      case 'preparing':
        return { label: 'Hazırlanıyor', bg: 'bg-blue-950 text-blue-400 border-blue-800', icon: RefreshCw };
      case 'in_transit':
        return { label: 'Soğuk Zincirde / Yolda', bg: 'bg-purple-950 text-purple-400 border-purple-800', icon: Truck };
      case 'delivered':
        return { label: 'Teslim Edildi', bg: 'bg-emerald-950 text-emerald-400 border-emerald-800', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'İptal Edildi', bg: 'bg-red-950 text-red-400 border-red-800', icon: AlertCircle };
      default:
        return { label: status, bg: 'bg-neutral-800 text-neutral-300 border-neutral-700', icon: Clock };
    }
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
    onUpdateOrders(updated);
  };

  // Delete order
  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`'${orderId}' numaralı siparişi silmek istediğinize emin misiniz?`)) {
      onUpdateOrders(orders.filter((o) => o.orderId !== orderId));
    }
  };

  // Toggle stock
  const handleToggleProductStock = (productId: string) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p));
    onUpdateProducts(updated);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      onUpdateProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.basePrice) return;

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({
              ...p,
              ...productFormData,
              basePrice: Number(productFormData.basePrice),
            } as Product)
          : p
      );
      onUpdateProducts(updated);
    } else {
      // Create new product
      const newId = `efc-${Date.now()}`;
      const slug = (productFormData.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newProd: Product = {
        id: newId,
        slug,
        name: productFormData.name || 'Yeni Et Ürünü',
        category: (productFormData.category as MeatCategory) || 'steak',
        categoryName:
          defaultCategories.find((c) => c.id === productFormData.category)?.name || 'Steakhouse Kesimleri',
        tagline: productFormData.tagline || 'Özel Efecioğlu Kesimi',
        description: productFormData.description || 'Efecioğlu çiftliğinde özenle yetiştirilmiş yerli besi.',
        basePrice: Number(productFormData.basePrice) || 500,
        unitWeight: productFormData.unitWeight || '500g',
        weights: [
          { label: '500g', grams: 500, multiplier: 1 },
          { label: '1000g', grams: 1000, multiplier: 1.95 },
        ],
        cutLocation: productFormData.cutLocation || 'Dana Sırt',
        agingDays: Number(productFormData.agingDays) || 21,
        fatRatio: productFormData.fatRatio || '%10 - %15',
        cookingMethods: productFormData.cookingMethods || ['Izgara', 'Tava'],
        cookingTimeMinutes: Number(productFormData.cookingTimeMinutes) || 6,
        origin: productFormData.origin || 'Balıkesir Efecioğlu Besi Çiftliği',
        inStock: productFormData.inStock ?? true,
        badge: productFormData.badge || 'Yeni',
        imageUrl:
          productFormData.imageUrl ||
          'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
        nutritionPer100g: productFormData.nutritionPer100g || { calories: 180, protein: 22, fat: 10, carbs: 0 },
        chefAdvice: productFormData.chefAdvice || 'Oda sıcaklığında dinlendirip yüksek ısıda mühürleyin.',
        accentColor: '#B91C1C',
      };
      onUpdateProducts([newProd, ...products]);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponPercent > 0 ? newCouponPercent : undefined,
      minSpend: newCouponMinSpend,
      description: newCouponDesc || `${newCouponCode.toUpperCase()} ile özel indirim`,
      isActive: true,
      usedCount: 0,
    };

    onUpdateCoupons([newCoupon, ...coupons]);
    setNewCouponCode('');
    setNewCouponDesc('');
    setIsCouponModalOpen(false);
  };

  // Toggle Coupon Active
  const handleToggleCoupon = (id: string) => {
    onUpdateCoupons(coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  // Delete Coupon
  const handleDeleteCoupon = (id: string) => {
    onUpdateCoupons(coupons.filter((c) => c.id !== id));
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tagline.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.cutLocation.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // WhatsApp quick notification message
  const getWhatsAppMessageUrl = (order: OrderReceipt) => {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? `9${phone}` : phone.startsWith('90') ? phone : `90${phone}`;
    const statusText =
      order.orderStatus === 'in_transit'
        ? 'Soğuk zincir frigorifik aracımıza yüklendi ve yola çıktı. +4°C kontrollü teslimatla kısa sürede adresinize ulaştırılacaktır.'
        : order.orderStatus === 'preparing'
        ? 'Et ustalarımız tarafından özenle dinlendirilip porsiyonlanıyor ve vakumlanıyor.'
        : order.orderStatus === 'delivered'
        ? 'Başarıyla teslim edildi. Afiyet olsun!'
        : 'Sistemimize alındı ve onaylandı.';

    const text = encodeURIComponent(
      `Merhaba Sayın ${order.customerName},\n\n` +
      `Efecioğlu Et (1984) üzerinden verdiğiniz #${order.orderId} numaralı siparişinizin durumu:\n` +
      `📦 Durum: ${statusText}\n\n` +
      `Toplam Tutar: ${order.grandTotal.toLocaleString('tr-TR')} ₺\n` +
      `Teslimat Adresi: ${order.customerAddress}\n\n` +
      `Bizi tercih ettiğiniz için teşekkür ederiz.\nEfecioğlu Gurme Kasap & Entegre Tesisleri\nTel: 0212 654 34 34`
    );

    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Outer Shell */}
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-7xl h-[94vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Top Header */}
        <header className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center text-white font-black text-sm shadow-md">
              1984
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wide text-white">
                  EFECİOĞLU ET — MAĞAZA & KASAP YÖNETİM PANELİ
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  v2.4 Canlı Yönetim
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Sipariş Takibi, Soğuk Zincir Lojistiği, Ürün Kataloğu ve Ciro Yönetimi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
                title="Paneli Kilitle"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Kilitle</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-neutral-950">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center mx-auto mb-4 text-red-400">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Yönetici Girişi (PIN)</h2>
              <p className="text-xs text-neutral-400 mb-6">
                Efecioğlu Et mağaza yönetici paneline erişmek için 4 haneli PIN kodunuzu giriniz.
              </p>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN Kodu (örn. 1984)"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  autoFocus
                />

                {pinError && (
                  <p className="text-xs text-red-400 flex items-center justify-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Hatalı PIN kodu! (Varsayılan: 1984)
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-lg"
                  >
                    Giriş Yap
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(true);
                      setPinError(false);
                    }}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Hızlı Demo Girişi (1984 Otomatik Doğrula)
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Şifreli Yönetici Oturumu</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Tab Navigation */}
            <aside className="w-full md:w-64 bg-neutral-950/80 border-b md:border-b-0 md:border-r border-neutral-800 p-4 flex md:flex-col gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Genel Bakış & Ciro</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Siparişler & Sevkiyat</span>
                </div>
                {activeOrdersCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-neutral-950 rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Ürün & Stok Yönetimi</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">{products.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'coupons'
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Kuponlar & İndirim</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Mağaza Ayarları</span>
              </button>

              {/* Bottom Quick Info */}
              <div className="mt-auto hidden md:block pt-4 border-t border-neutral-800/80">
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Soğuk Zincir Durumu:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Aktif (+4°C)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Tesis:</span>
                    <span className="text-white font-medium">Beylikdüzü Entegre</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-900/60">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Toplam Ciro
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-white">
                          {totalRevenue.toLocaleString('tr-TR')} ₺
                        </div>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                          <TrendingUp className="w-3 h-3" /> +%18 geçen haftaya göre
                        </p>
                      </div>
                    </div>

                    <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Toplam Sipariş
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-white">{totalOrdersCount} Adet</div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {activeOrdersCount} aktif işlemde
                        </p>
                      </div>
                    </div>

                    <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Ortalama Sepet
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-white">
                          {averageOrderValue.toLocaleString('tr-TR')} ₺
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">Gurme et & steak sepeti</p>
                      </div>
                    </div>

                    <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Katalog Ürünleri
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-white">{products.length} Çeşit</div>
                        <p className="text-[11px] text-amber-400 mt-1">
                          {outOfStockCount > 0 ? `${outOfStockCount} ürün tükendi` : 'Tüm ürünler stokta'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders and Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 cols: Recent Orders */}
                    <div className="lg:col-span-2 bg-neutral-950 rounded-2xl border border-neutral-800 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-white">Son Alınan Siparişler</h3>
                          <p className="text-xs text-neutral-400">Canlı soğuk zincir sipariş kuyruğu</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          Tümünü Gör <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {orders.slice(0, 4).map((order) => {
                          const badge = getStatusBadge(order.orderStatus);
                          const IconComp = badge.icon;
                          return (
                            <div
                              key={order.orderId}
                              className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                                  <ShoppingBag className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-amber-400">
                                      #{order.orderId}
                                    </span>
                                    <span className="text-sm font-bold text-white">{order.customerName}</span>
                                  </div>
                                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                                    {order.items.map((i) => `${i.product.name} (${i.selectedWeight.label})`).join(', ')}
                                  </p>
                                  <span className="text-[11px] text-neutral-500">{order.createdAt}</span>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                <div className="text-sm font-black text-white">
                                  {order.grandTotal.toLocaleString('tr-TR')} ₺
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${badge.bg}`}
                                >
                                  <IconComp className="w-3 h-3" />
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right col: Quick Management Shortcuts */}
                    <div className="space-y-4">
                      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5">
                        <h3 className="text-sm font-bold text-white mb-3">Hızlı İşlemler</h3>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setEditingProduct(null);
                              setIsProductModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left text-xs font-semibold text-white transition-colors cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center group-hover:bg-red-700 group-hover:text-white transition-colors">
                              <Plus className="w-4 h-4" />
                            </div>
                            <div>
                              <div>Yeni Et / Ürün Ekle</div>
                              <span className="text-[10px] text-neutral-400 font-normal">Kataloğa yeni kesim ekle</span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setIsCouponModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left text-xs font-semibold text-white transition-colors cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              <Tag className="w-4 h-4" />
                            </div>
                            <div>
                              <div>Yeni İndirim Kuponu Oluştur</div>
                              <span className="text-[10px] text-neutral-400 font-normal">Yüzde veya TL indirim</span>
                            </div>
                          </button>

                          <button
                            onClick={() => setActiveTab('orders')}
                            className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left text-xs font-semibold text-white transition-colors cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <div>Frigorifik Sevkiyat Listesi</div>
                              <span className="text-[10px] text-neutral-400 font-normal">Yoldaki siparişleri takip et</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Meat Aging & Facility Status Card */}
                      <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl border border-neutral-800 p-5">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Himalaya Tuz Odası Durumu</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                          Tüm karkaslar 0°C ile +2°C aralığında ve %80 nem oranında olgunlaştırılmaktadır.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                            <span className="text-[10px] text-neutral-400 block">Sıcaklık</span>
                            <span className="text-white font-mono font-bold">+1.2 °C</span>
                          </div>
                          <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                            <span className="text-[10px] text-neutral-400 block">Nem Oranı</span>
                            <span className="text-white font-mono font-bold">%82</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Sipariş no, müşteri adı veya telefon ara..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 py-2 px-3 rounded-xl focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="all">Tüm Durumlar ({orders.length})</option>
                        <option value="pending">Beklemede</option>
                        <option value="preparing">Hazırlanıyor</option>
                        <option value="in_transit">Soğuk Zincirde / Yolda</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                          <tr>
                            <th className="py-3.5 px-4">Sipariş No & Tarih</th>
                            <th className="py-3.5 px-4">Müşteri & İletişim</th>
                            <th className="py-3.5 px-4">Ürünler</th>
                            <th className="py-3.5 px-4">Tutar & Ödeme</th>
                            <th className="py-3.5 px-4">Durum</th>
                            <th className="py-3.5 px-4 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-neutral-500">
                                Aradığınız kriterlere uygun sipariş bulunamadı.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => {
                              const badge = getStatusBadge(order.orderStatus);
                              return (
                                <tr key={order.orderId} className="hover:bg-neutral-900/50 transition-colors">
                                  {/* ID & Date */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="font-mono font-bold text-amber-400">#{order.orderId}</div>
                                    <div className="text-[11px] text-neutral-500">{order.createdAt}</div>
                                    <div className="text-[10px] text-neutral-400">
                                      {order.deliveryMethod === 'same-day' ? 'Frigorifik (+4°C)' : 'Termobox Kargo'}
                                    </div>
                                  </td>

                                  {/* Customer */}
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-white">{order.customerName}</div>
                                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                      <Phone className="w-3 h-3 text-neutral-500" />
                                      {order.customerPhone}
                                    </div>
                                    <div className="text-[10px] text-neutral-500 line-clamp-1 max-w-[200px]">
                                      {order.customerAddress}
                                    </div>
                                  </td>

                                  {/* Items */}
                                  <td className="py-3 px-4">
                                    <div className="space-y-0.5 max-w-[220px]">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="text-xs text-neutral-300 truncate">
                                          <span className="font-bold text-amber-400">{item.quantity}x</span>{' '}
                                          {item.product.name} ({item.selectedWeight.label})
                                        </div>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Price & Payment */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="font-black text-sm text-white">
                                      {order.grandTotal.toLocaleString('tr-TR')} ₺
                                    </div>
                                    <div className="text-[10px] text-neutral-400">
                                      {order.paymentMethod === 'credit_card'
                                        ? '3D Secure Kredi Kartı'
                                        : order.paymentMethod === 'cash_on_delivery'
                                        ? 'Kapıda Ödeme'
                                        : 'Banka Havalesi'}
                                    </div>
                                    {order.couponCode && (
                                      <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] bg-red-950 text-red-400 rounded border border-red-800">
                                        {order.couponCode}
                                      </span>
                                    )}
                                  </td>

                                  {/* Status dropdown */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <select
                                      value={order.orderStatus}
                                      onChange={(e) =>
                                        handleUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)
                                      }
                                      className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${badge.bg}`}
                                    >
                                      <option value="pending">Beklemede</option>
                                      <option value="preparing">Hazırlanıyor</option>
                                      <option value="in_transit">Soğuk Zincirde</option>
                                      <option value="delivered">Teslim Edildi</option>
                                      <option value="cancelled">İptal Edildi</option>
                                    </select>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3 px-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* WhatsApp notification button */}
                                      <a
                                        href={getWhatsAppMessageUrl(order)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Müşteriye WhatsApp ile Durum Bildir"
                                        className="p-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded-lg border border-emerald-800 transition-colors cursor-pointer"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </a>

                                      {/* Print Receipt / Waybill */}
                                      <button
                                        onClick={() => setSelectedOrderReceipt(order)}
                                        title="Sipariş Fişi & Sevk İrsaliyesi"
                                        className="p-1.5 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg border border-neutral-700 transition-colors cursor-pointer"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Delete */}
                                      <button
                                        onClick={() => handleDeleteOrder(order.orderId)}
                                        title="Siparişi Sil"
                                        className="p-1.5 bg-neutral-900 text-neutral-400 hover:bg-red-900 hover:text-red-200 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS & INVENTORY MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Top Bar with Search & Add Product Button */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Et adı, kesim bölgesi veya açıklama ara..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 py-2 px-3 rounded-xl focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="all">Tüm Kategoriler</option>
                        {defaultCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductFormData({
                            name: '',
                            category: 'steak',
                            categoryName: 'Steakhouse Kesimleri',
                            tagline: '',
                            description: '',
                            basePrice: 550,
                            unitWeight: '500g',
                            cutLocation: 'Dana Sırt',
                            agingDays: 21,
                            fatRatio: '%12 - %15',
                            cookingMethods: ['Izgara', 'Tava'],
                            cookingTimeMinutes: 6,
                            origin: 'Balıkesir Efecioğlu Besi Çiftliği',
                            inStock: true,
                            badge: 'Yeni',
                            imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
                            nutritionPer100g: { calories: 180, protein: 22, fat: 10, carbs: 0 },
                            chefAdvice: 'Oda sıcaklığında 20 dakika beklettikten sonra mühürleyin.',
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Et Ekle</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`bg-neutral-950 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                          product.inStock ? 'border-neutral-800 hover:border-neutral-700' : 'border-red-950/60 opacity-75'
                        }`}
                      >
                        {/* Image & Badges Header */}
                        <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <Package className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            {product.badge && (
                              <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-black rounded uppercase tracking-wider shadow">
                                {product.badge}
                              </span>
                            )}
                            {product.agingDays && (
                              <span className="px-2 py-0.5 bg-amber-500/90 text-neutral-950 text-[10px] font-black rounded uppercase tracking-wider shadow">
                                {product.agingDays} GÜN DRY-AGED
                              </span>
                            )}
                          </div>

                          {/* Stock Toggle on image corner */}
                          <button
                            onClick={() => handleToggleProductStock(product.id)}
                            className={`absolute top-2.5 right-2.5 px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
                              product.inStock
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                                : 'bg-red-950/80 text-red-400 border-red-700/60'
                            }`}
                          >
                            {product.inStock ? '✓ Stokta' : '✕ Tükendi'}
                          </button>

                          {/* Category overlay */}
                          <div className="absolute bottom-2 left-3 text-[11px] text-amber-400 font-semibold tracking-wide">
                            {product.categoryName}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center gap-2 mt-3 text-[11px] text-neutral-400">
                              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded">
                                {product.cutLocation}
                              </span>
                              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded">
                                {product.fatRatio}
                              </span>
                            </div>
                          </div>

                          {/* Footer with Price & Actions */}
                          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-neutral-500 block">Başlangıç Fiyatı:</span>
                              <span className="text-lg font-black text-amber-400">
                                {product.basePrice.toLocaleString('tr-TR')} ₺
                              </span>
                              <span className="text-[11px] text-neutral-400"> / {product.unitWeight}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(product)}
                                className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-lg border border-neutral-700 transition-colors cursor-pointer"
                                title="Düzenle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-300 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: COUPONS & DISCOUNTS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold text-white">İndirim Kuponları & Kampanyalar</h3>
                      <p className="text-xs text-neutral-400">Müşterilerin sepette kullanabileceği promosyon kodları</p>
                    </div>

                    <button
                      onClick={() => setIsCouponModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Kupon Tanımla</span>
                    </button>
                  </div>

                  {/* Coupons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          coupon.isActive ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-950/60 border-neutral-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-base font-black px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-lg">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleToggleCoupon(coupon.id)}
                            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer ${
                              coupon.isActive
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {coupon.isActive ? 'Aktif' : 'Pasif'}
                          </button>
                        </div>

                        <div className="text-xl font-black text-white mb-1">
                          {coupon.discountPercent ? `%${coupon.discountPercent} İndirim` : `${coupon.discountAmount} ₺ İndirim`}
                        </div>
                        <p className="text-xs text-neutral-400 mb-4">{coupon.description}</p>

                        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                          <span>Min: {coupon.minSpend?.toLocaleString('tr-TR')} ₺</span>
                          <span className="font-medium text-amber-400">{coupon.usedCount} kez kullanıldı</span>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                            title="Kuponu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-base font-bold text-white">Mağaza & İletişim Ayarları</h3>
                    <p className="text-xs text-neutral-400">Efecioğlu Et kurumsal iletişim ve operasyon bilgileri</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Marka & Ticari Unvan</label>
                      <input
                        type="text"
                        value={config.brandName}
                        onChange={(e) => onUpdateConfig({ ...config, brandName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Kuruluş Yılı</label>
                        <input
                          type="text"
                          value={config.establishedYear}
                          onChange={(e) => onUpdateConfig({ ...config, establishedYear: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Ücretsiz Kargo Alt Limiti (₺)</label>
                        <input
                          type="number"
                          value={config.freeShippingThreshold}
                          onChange={(e) => onUpdateConfig({ ...config, freeShippingThreshold: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Sabit Telefon</label>
                        <input
                          type="text"
                          value={config.phone}
                          onChange={(e) => onUpdateConfig({ ...config, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">WhatsApp Sipariş Hattı</label>
                        <input
                          type="text"
                          value={config.whatsapp}
                          onChange={(e) => onUpdateConfig({ ...config, whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Tesis & Mağaza Adresi</label>
                      <input
                        type="text"
                        value={config.address}
                        onChange={(e) => onUpdateConfig({ ...config, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Tüm ayarlar anında canlı mağazaya ve vitrine yansıtılmaktadır.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Et Ürününü Düzenle' : 'Yeni Et / Kesim Ekle'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Ürün Adı</label>
                <input
                  type="text"
                  required
                  value={productFormData.name || ''}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="örn: Efecioğlu Dry-Aged Tomahawk Steak"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Kategori</label>
                  <select
                    value={productFormData.category || 'steak'}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        category: e.target.value as MeatCategory,
                        categoryName:
                          defaultCategories.find((c) => c.id === e.target.value)?.name || 'Steakhouse Kesimleri',
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    {defaultCategories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Başlangıç Fiyatı (₺)</label>
                  <input
                    type="number"
                    required
                    value={productFormData.basePrice || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, basePrice: Number(e.target.value) })}
                    placeholder="580"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Kesim Bölgesi</label>
                  <input
                    type="text"
                    value={productFormData.cutLocation || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, cutLocation: e.target.value })}
                    placeholder="örn: Dana Sırt Kaburga"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Dry-Aged Gün Sayısı</label>
                  <input
                    type="number"
                    value={productFormData.agingDays || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, agingDays: Number(e.target.value) })}
                    placeholder="28"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Vurgu / Slogan</label>
                <input
                  type="text"
                  value={productFormData.tagline || ''}
                  onChange={(e) => setProductFormData({ ...productFormData, tagline: e.target.value })}
                  placeholder="örn: 28 gün özel tuz odasında dinlendirilmiş enfes lezzet"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={productFormData.description || ''}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Etin özellikleri, mermerleşme yapısı ve lezzet profili..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Fotoğraf URL (Unsplash veya Et Görseli)</label>
                <input
                  type="url"
                  value={productFormData.imageUrl || ''}
                  onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productFormData.inStock ?? true}
                  onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-neutral-950 border-neutral-700 cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-neutral-300 font-medium cursor-pointer">
                  Hemen Satışta (Stokta Var)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Kaydet & Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD COUPON */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white">Yeni Kupon Oluştur</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Kupon Kodu</label>
                <input
                  type="text"
                  required
                  placeholder="örn: EFECIOGLU20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono font-bold uppercase focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">İndirim Yüzdesi (%)</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Minimum Sepet Tutarı (₺)</label>
                <input
                  type="number"
                  value={newCouponMinSpend}
                  onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Kupon Açıklaması</label>
                <input
                  type="text"
                  placeholder="örn: 1.000 TL üzeri %10 indirim"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Kuponu Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL SEVK İRSALİYESİ / SİPARİŞ FİŞİ (PRINTABLE RECEIPT) */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header controls (No print) */}
            <div className="bg-neutral-950 text-white px-6 py-3 flex items-center justify-between shrink-0 print:hidden">
              <span className="text-xs font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Resmi Sevk İrsaliyesi & Sipariş Fişi
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır</span>
                </button>
                <button
                  onClick={() => setSelectedOrderReceipt(null)}
                  className="p-1 hover:text-neutral-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Waybill Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs font-sans">
              <div className="border-b-2 border-neutral-900 pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-neutral-950">EFECİOĞLU ET (1984)</h2>
                  <p className="text-[11px] text-neutral-600 font-medium">
                    Entegre Et Tesisleri & Gurme Kasapçılık A.Ş.
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Çiftlik Yolu No:18 Beylikdüzü / İstanbul · Tel: 0212 654 34 34
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold bg-neutral-100 px-2.5 py-1 rounded border border-neutral-300 inline-block">
                    #{selectedOrderReceipt.orderId}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">{selectedOrderReceipt.createdAt}</div>
                  <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider mt-0.5">
                    Soğuk Zincir (+4°C)
                  </div>
                </div>
              </div>

              {/* Customer and Courier Details */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Teslim Edilecek Alıcı:</span>
                  <div className="font-bold text-neutral-900 text-sm mt-0.5">{selectedOrderReceipt.customerName}</div>
                  <div className="text-neutral-700 font-mono text-xs">{selectedOrderReceipt.customerPhone}</div>
                  <div className="text-neutral-600 text-[11px] mt-1">{selectedOrderReceipt.customerAddress}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Ödeme & Sevkiyat:</span>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    {selectedOrderReceipt.paymentMethod === 'credit_card'
                      ? '3D Secure Kredi Kartı (Ödendi)'
                      : selectedOrderReceipt.paymentMethod === 'cash_on_delivery'
                      ? 'Kapıda Ödeme (Tahsil Edilecek)'
                      : 'Banka Havalesi'}
                  </div>
                  <div className="text-neutral-600 text-[11px] mt-1">
                    Araç: {selectedOrderReceipt.courierName || 'Efecioğlu Frigorifik Kurye #01'}
                  </div>
                  {selectedOrderReceipt.notes && (
                    <div className="text-[11px] text-neutral-700 mt-1 bg-amber-50 p-1.5 rounded border border-amber-200">
                      <strong>Müşteri Notu:</strong> {selectedOrderReceipt.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-900 text-neutral-900 font-bold">
                    <th className="py-2">Ürün Adı & Gramaj</th>
                    <th className="py-2 text-center">Miktar</th>
                    <th className="py-2 text-right">Birim Fiyat</th>
                    <th className="py-2 text-right">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {selectedOrderReceipt.items.map((item, idx) => {
                    const linePrice = Math.round(item.product.basePrice * item.selectedWeight.multiplier);
                    return (
                      <tr key={idx} className="py-2">
                        <td className="py-2 font-medium">
                          {item.product.name}
                          <span className="text-[10px] text-neutral-500 block">
                            Porsiyon: {item.selectedWeight.label}
                          </span>
                        </td>
                        <td className="py-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2 text-right">{linePrice.toLocaleString('tr-TR')} ₺</td>
                        <td className="py-2 text-right font-bold">
                          {(linePrice * item.quantity).toLocaleString('tr-TR')} ₺
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t-2 border-neutral-900 pt-3 flex flex-col items-end text-xs space-y-1">
                <div className="flex justify-between w-48 text-neutral-600">
                  <span>Ara Toplam:</span>
                  <span>{selectedOrderReceipt.subtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                {selectedOrderReceipt.discountAmount ? (
                  <div className="flex justify-between w-48 text-red-700 font-semibold">
                    <span>İndirim ({selectedOrderReceipt.couponCode}):</span>
                    <span>-{selectedOrderReceipt.discountAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                ) : null}
                <div className="flex justify-between w-48 text-neutral-600">
                  <span>Soğuk Zincir Kargo:</span>
                  <span>
                    {selectedOrderReceipt.shippingCost === 0 ? 'Ücretsiz' : `${selectedOrderReceipt.shippingCost} ₺`}
                  </span>
                </div>
                <div className="flex justify-between w-48 text-base font-black text-neutral-950 pt-2 border-t border-neutral-300">
                  <span>Genel Toplam:</span>
                  <span>{selectedOrderReceipt.grandTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {/* Official Seal / Signature Footer */}
              <div className="pt-6 border-t border-neutral-300 flex items-center justify-between text-[10px] text-neutral-500">
                <div>
                  <p>Bu belge sevk irsaliyesi ve sipariş teyit fişi yerine geçer.</p>
                  <p>Gıda güvenliği standardı: ISO 22000 & Helal Kesim Belgeli</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-neutral-800">Efecioğlu Et Sevkiyat Yetkilisi</div>
                  <div className="h-8 border-b border-dashed border-neutral-400 mt-1 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
