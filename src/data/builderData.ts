import { SitePage, GoogleSitesTheme, SiteSection } from '../types/siteBuilder';

export const defaultThemes: GoogleSitesTheme[] = [
  {
    id: 'aristocrat-gourmet',
    name: 'Aristokrat Gurme (Siyah & Kırmızı)',
    primaryColor: '#B91C1C',
    accentColor: '#F59E0B',
    bgDark: '#0A0A0A',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'classic-butcher',
    name: 'Klasik Kasap (Kırmızı & Beyaz)',
    primaryColor: '#DC2626',
    accentColor: '#EF4444',
    bgDark: '#171717',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'luxury-gold',
    name: 'Modern Altın (Obsidian & Amber)',
    primaryColor: '#D97706',
    accentColor: '#FBBF24',
    bgDark: '#0C0A09',
    fontFamily: 'Outfit',
  },
  {
    id: 'pure-minimal',
    name: 'Minimalist Şef (Koyu Füme)',
    primaryColor: '#3B82F6',
    accentColor: '#38BDF8',
    bgDark: '#0F172A',
    fontFamily: 'Plus Jakarta Sans',
  },
];

export const initialHomeSections: SiteSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Ustalıkla Dinlendirilmiş, Gerçek Et Lezzeti Sofranızda',
    subtitle: "1905'ten beri geleneksel Türk kasaplık sanatı ve AB onaylı entegre tesis güvencesiyle.",
    bgColor: 'bg-neutral-950',
    isVisible: true,
  },
  {
    id: 'sec-catalog',
    type: 'catalog',
    title: 'Seçkin Et & Şarküteri Kataloğu',
    subtitle: 'Himalaya tuz odalarında 28 gün dinlendirilmiş steak kesimleri, taze kuzu ve şarküteri lezzetleri.',
    bgColor: 'bg-neutral-900',
    isVisible: true,
  },
  {
    id: 'sec-about',
    type: 'about',
    title: '120 Yıllık Et Ustalığı & Güvenilir Üretim Kültürü',
    subtitle: "1905'te başlayan serüven, 15.000 m² Beylikdüzü tesisimizde en üst hijyen normlarıyla sürüyor.",
    bgColor: 'bg-neutral-950',
    isVisible: true,
  },
  {
    id: 'sec-cooking',
    type: 'cooking-guide',
    title: 'Steak & Et Pişirme Rehberi',
    subtitle: 'İnteraktif iç sıcaklık dereceleri ve döküm tavada mühürleme teknikleri.',
    bgColor: 'bg-neutral-900',
    isVisible: true,
  },
  {
    id: 'sec-horeca',
    type: 'horeca',
    title: 'Restoran, Otel & Şefler İçin Endüstriyel Et Tedariği',
    subtitle: 'Sabit gramaj, sıfır fire ve özel frigorifik filomuzla toptan Horeca et çözümleri.',
    bgColor: 'bg-neutral-950',
    isVisible: true,
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: 'Ustalara İlham Veren Lezzet',
    subtitle: 'Türkiye’nin önde gelen şeflerinin ve steakhouse yöneticilerinin değerlendirmeleri.',
    bgColor: 'bg-neutral-900',
    isVisible: true,
  },
];

export const initialPages: SitePage[] = [
  {
    id: 'page-home',
    name: 'Ana Sayfa',
    slug: 'home',
    isHome: true,
    sections: initialHomeSections,
  },
  {
    id: 'page-products',
    name: 'Ürünlerimiz',
    slug: 'urunler',
    isHome: false,
    sections: [
      {
        id: 'sec-catalog-only',
        type: 'catalog',
        title: 'Tüm Taze Et & Steakhouse Çeşitlerimiz',
        subtitle: 'Dana bonfile, Dallas steak, kuzu pirzola, sucuk ve yaprak döner çeşitleri.',
        bgColor: 'bg-neutral-950',
        isVisible: true,
      },
      {
        id: 'sec-features-quality',
        type: 'features-grid',
        title: 'Bonfilet Kalite Güvencesi',
        subtitle: 'Veteriner kontrolü, soğuk zincir lojistiği ve TSE Helal sertifikası.',
        bgColor: 'bg-neutral-900',
        isVisible: true,
      },
    ],
  },
  {
    id: 'page-heritage',
    name: '1905 Mirası & Tesis',
    slug: 'kurumsal',
    isHome: false,
    sections: [
      {
        id: 'sec-about-deep',
        type: 'about',
        title: '1905’ten Bugüne Et Sektöründe Öncü',
        subtitle: 'Osmanlı’dan günümüze 4 kuşaklık kasaplık zanaatı ve 15.000 m² entegre tesisimiz.',
        bgColor: 'bg-neutral-950',
        isVisible: true,
      },
      {
        id: 'sec-testimonials-deep',
        type: 'testimonials',
        title: 'İş Ortaklarımızın Görüşleri',
        subtitle: 'Executive şeflerin tercihi.',
        bgColor: 'bg-neutral-900',
        isVisible: true,
      },
    ],
  },
  {
    id: 'page-chef',
    name: 'Şefin Rehberi',
    slug: 'sef-rehberi',
    isHome: false,
    sections: [
      {
        id: 'sec-cooking-full',
        type: 'cooking-guide',
        title: 'Şefin Pişirme ve Dinlendirme Teknikleri',
        subtitle: 'Evde ve profesyonel mutfakta kusursuz et pişirme dereceleri.',
        bgColor: 'bg-neutral-950',
        isVisible: true,
      },
    ],
  },
  {
    id: 'page-horeca',
    name: 'HORECA (B2B)',
    slug: 'horeca',
    isHome: false,
    sections: [
      {
        id: 'sec-horeca-full',
        type: 'horeca',
        title: 'Ev Dışı Tüketim (EDT) Toptan Tedarik',
        subtitle: 'Restoran ve oteller için özel porsiyonlanmış karkas ve dilim et teklifleri.',
        bgColor: 'bg-neutral-950',
        isVisible: true,
      },
    ],
  },
  {
    id: 'page-contact',
    name: 'İletişim & Konum',
    slug: 'iletisim',
    isHome: false,
    sections: [
      {
        id: 'sec-contact-block',
        type: 'contact',
        title: 'Fabrika Satış Mağazası & İletişim',
        subtitle: 'Beylikdüzü tesisimizi ziyaret edin veya doğrudan bize ulaşın.',
        bgColor: 'bg-neutral-950',
        isVisible: true,
      },
    ],
  },
];
