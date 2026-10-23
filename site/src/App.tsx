import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Flame, Heart, ShoppingBag, Search, Utensils, X } from 'lucide-react';
import { OzlemceLogo } from './components/OzlemceLogo';
import { catalogCategories, categoryById, imagePath, type CatalogProduct } from './data/catalog';
import { catalogHref, filterCatalog, readRoute } from './lib/catalog';

import { CatalogProvider, useCatalog } from './cms/CatalogContext';
import { ShopProvider, useShop, ProductCard, PurchaseOptions, Favorites } from './shop/Shop';
import { pricePerKg } from './shop/pricing';
const AdminApp = lazy(() => import('./cms/AdminApp'));

const homeHref = '#/ana-sayfa';
const guides = [
  {id:'izgara', name:'Izgara', title:'Ateşin etrafında buluşalım.', text:'Antrikot, pirzola ve köfte; ızgara sofralarının farklı karakterleri. Benzer kalınlıktaki parçaları birlikte hazırlayın, servis tabağını önceden planlayın.', tip:'Etin yanında közlenmiş mevsim sebzelerine ve taze bir salataya yer açın.', image:'izgara'},
  {id:'tava', name:'Tava', title:'Bir tava, pek çok olasılık.', text:'Bonfileden burger köftesine, tavada hazırlayabileceğiniz ürünleri keşfedin. Tavayı önceden ısıtın ve malzemeleri tek sıra halinde yerleştirebileceğiniz bir boyut seçin.', tip:'Tavayı fazla doldurmamak, etin yüzeyinin dengeli pişmesine yardımcı olur.', image:'steak'},
  {id:'firin', name:'Fırın', title:'Sofraya biraz zaman ayırın.', text:'Kuzu incik ve pirzola ile fırın tariflerine yer açın. Pişirme kabını, süreyi ve hazırlık yöntemini seçtiğiniz kesime göre belirleyin.', tip:'Kök sebzeler ve taze otlar, fırın yemeklerine güzel bir eşlikçi olur.', image:'kuzu'},
  {id:'tencere', name:'Tencere', title:'Birlikte pişen lezzetler.', text:'Kuşbaşı ve incik; güveçlerden sebzeli tencere yemeklerine uzanan tariflerin başlangıcı. Benzer boyutta doğranmış malzemelerle hazırlığınızı kolaylaştırın.', tip:'Sebzelerin farklı pişme sürelerini göz önünde bulundurarak tencereye ekleyin.', image:'bonfile'},
];

function Header({ hash }: { hash: string }) {
  const {path,params}=readRoute(hash);
  const {items,favorites,open}=useShop();
  const [query,setQuery]=useState('');
  useEffect(()=>{setQuery(params.get('ara')||'');},[hash]);
  function search(event:FormEvent){event.preventDefault();window.location.hash=catalogHref('all',query);}
  return <>
    <div className="shop-top"><div className="shell"><span>SOFRANIZA YAKIŞAN LEZZETLER, ÖZLEMCE’DE.</span><div><a href="#/hakkimizda">Hakkımızda</a><a href="#/yardim">Yardım</a></div></div></div>
    <header className="shop-header"><div className="shell shop-header-main"><a className="brand-link" href={homeHref} aria-label="Özlemce ana sayfa"><OzlemceLogo size="lg"/></a><form className="shop-search" role="search" onSubmit={search}><Search size={20}/><label className="sr-only" htmlFor="store-search">Ürün ara</label><input id="store-search" type="search" placeholder="Bugün sofranızda ne var? Bonfile, köfte, kuzu…" maxLength={100} value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit" aria-label="Ürünleri ara"><ArrowRight size={21}/></button></form><div className="shop-actions"><a href="#/favoriler" aria-label={`Favorilerim, ${favorites.length} ürün`} className="shop-header-action"><Heart size={22}/><span>Favorilerim</span>{favorites.length>0&&<b>{favorites.length}</b>}</a><button className="shop-header-action cart-trigger" onClick={open} aria-label={`Sepetim, ${items.reduce((n,i)=>n+i.quantity,0)} ürün`}><ShoppingBag size={22}/><span>Sepetim</span><b>{items.reduce((n,i)=>n+i.quantity,0)}</b></button></div></div><nav className="shop-category-nav shell" aria-label="Ürün kategorileri"><a href={catalogHref()} aria-current={path==='urunler'&&!params.has('kategori')?'page':undefined}>Tüm ürünler</a>{catalogCategories.map(c=><a key={c.id} href={catalogHref(c.id)} aria-current={params.get('kategori')===c.id?'page':undefined}>{c.shortName}</a>)}<a href="#/rehber" className="shop-guide-link">Mutfak rehberi <ArrowUpRight size={14}/></a></nav></header>
  </>;
}

export function Home() {
  const {home,products}=useCatalog();
  const [category,setCategory]=useState('all');
  const selection=home.featuredIds.flatMap(id=>products.find(p=>p.id===id)?[products.find(p=>p.id===id)!]:[]);
  const visible=category==='all'?products.slice(0,8):products.filter(p=>p.category===category);
  return <div className="shop-home">
    <section className="shop-hero shell" aria-labelledby="hero-title"><div className="shop-hero-copy"><span className="eyebrow">{home.heroEyebrow}</span><h1 id="hero-title">{home.heroTitle} <em>{home.heroAccent}</em></h1><p>{home.heroDescription}</p><a className="button" href={catalogHref()}>{home.heroButton} <ArrowRight size={18}/></a></div><div className="shop-hero-photo"><img src={imagePath(home.heroImage)} alt={home.heroImageAlt} fetchPriority="high" width="1000" height="700"/><div className="shop-hero-caption"><span>ÖZLEMCE SEÇKİSİ</span><p>{home.heroCaption}</p></div></div></section>
    <section className="shop-categories shell" aria-labelledby="category-title"><div className="shop-section-heading"><h2 id="category-title">{home.categoriesTitle}</h2><a className="text-link" href={catalogHref()}>Tüm ürünler <ArrowRight size={16}/></a></div><div className="shop-category-grid">{catalogCategories.map(c=><a key={c.id} href={catalogHref(c.id)}><img src={imagePath(c.image)} alt="" loading="lazy" width="160" height="160"/><span>{c.shortName}</span><small>{products.filter(p=>p.category===c.id).length} ürün</small></a>)}</div></section>
    {selection.length>0&&<section className="shop-featured shell" aria-labelledby="featured-title"><div className="shop-section-heading"><div><span className="eyebrow">ÖNE ÇIKAN ÜRÜNLER</span><h2 id="featured-title">{home.featuredTitle}</h2><p>{home.featuredDescription}</p></div><a className="text-link" href={catalogHref()}>Hepsini gör <ArrowRight size={17}/></a></div><div className="product-grid">{selection.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
    <section className="shop-promos shell" aria-label="Sofranıza göre ürün seçimi"><a href={catalogHref('all','ızgara')}><img src={imagePath('izgara')} alt="" loading="lazy" width="650" height="400"/><div><span className="eyebrow">ATEŞİN ETRAFINDA BULUŞALIM</span><h2>Mangalın<br/>başrolleri.</h2><span className="promo-link">Izgaralık ürünler <ArrowRight size={18}/></span></div></a><a href={catalogHref('meatball')}><img src={imagePath('burger')} alt="" loading="lazy" width="650" height="400"/><div><span className="eyebrow">KENDİ LEZZETİNİZİ HAZIRLAYIN</span><h2>Bugün menüde<br/>burger var.</h2><span className="promo-link">Köfte & burger <ArrowRight size={18}/></span></div></a></section>
    <section className="shop-range shell" aria-labelledby="range-title"><div className="shop-section-heading"><div><span className="eyebrow">ÖZLEMCE MAĞAZA</span><h2 id="range-title">Sofranızın ihtiyacı burada.</h2></div><a className="text-link" href={catalogHref(category)}>Tümünü incele <ArrowRight size={17}/></a></div><div className="shop-range-tabs" aria-label="Ana sayfa ürün filtresi"><button aria-pressed={category==='all'} onClick={()=>setCategory('all')}>Tümünden seçtiklerimiz</button>{catalogCategories.map(c=><button key={c.id} aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}>{c.shortName}</button>)}</div><div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={p}/>)}</div>{visible.length===0&&<p className="empty-state">Bu kategoride henüz ürün yok.</p>}<p className="shop-price-note">Gösterilen tutarlar tahmini fiyatlardır. Görseller sunum önerisidir. Şu anda online sipariş ve ödeme alınmıyor.</p></section>
    <section className="shop-editorial shell"><img src={imagePath(home.editorialImage)} alt={home.editorialImageAlt} loading="lazy" width="700" height="700"/><div><span className="eyebrow">{home.editorialEyebrow}</span><h2>{home.editorialTitle} <em>{home.editorialAccent}</em></h2><p>{home.editorialDescription}</p><a className="text-link" href="#/rehber">{home.editorialButton} <ArrowUpRight size={18}/></a></div></section><section className="shop-brand-note shell"><h2>{home.brandTitle} <em>{home.brandAccent}</em></h2><a className="text-link" href="#/hakkimizda">Özlemce’yi tanıyın <ArrowRight size={17}/></a></section>
  </div>;
}

function Catalog({ category, query }: { category: string; query: string }) {
  const {products:catalogProducts}=useCatalog();
  const [search, setSearch] = useState(query);
  const [sort, setSort] = useState('selection');
  useEffect(()=>{setSearch(query);},[query]);
  const validCategory = categoryById(category) ? category : 'all';
  const products = filterCatalog(catalogProducts, validCategory, query);
  const sorted = sort==='name' ? [...products].sort((a,b)=>a.name.localeCompare(b.name,'tr')) : sort==='price'?[...products].sort((a,b)=>(pricePerKg(a)??Infinity)-(pricePerKg(b)??Infinity)):products;
  function submit(event: FormEvent) {event.preventDefault();window.location.hash=catalogHref(validCategory,search);}
  return <div className="shell page-content"><div className="page-intro"><div><span className="eyebrow">ÖZLEMCE ÜRÜN KATALOĞU</span><h1>Sofranız için<br/><em>doğru seçim.</em></h1></div><p>Ürününüzü seçin, gramajını belirleyin.<br/>Sofranız için sepetinizi oluşturun.</p></div>
    <div className="catalog-tools"><form className="catalog-search" onSubmit={submit} role="search"><Search size={19}/><label className="sr-only" htmlFor="catalog-search">Ürün veya pişirme yöntemi ara</label><input id="catalog-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün veya pişirme yöntemi ara" maxLength={100}/><button type="submit" aria-label="Katalogda ara"><ArrowRight size={20}/></button></form><label className="sort-label">Sırala <select value={sort} onChange={e=>setSort(e.target.value)}><option value="selection">Özlemce seçkisi</option><option value="name">İsme göre A–Z</option><option value="price">Kilogram fiyatı artan</option></select><ChevronDown size={15}/></label></div>
    <nav className="category-filters" aria-label="Ürün kategorileri"><a href={catalogHref('all',query)} aria-current={validCategory==='all'?'page':undefined}>Tüm ürünler</a>{catalogCategories.map(category=><a key={category.id} href={catalogHref(category.id,query)} aria-current={validCategory===category.id?'page':undefined}>{category.shortName}</a>)}</nav>
    <div className="catalog-count" role="status" aria-live="polite"><span>{categoryById(validCategory)?.name||'Tüm ürünler'} <b>({products.length})</b>{query && <> · “{query}”</>}</span>{(query||validCategory!=='all')&&<a href={catalogHref()}>Filtreleri temizle <X size={14}/></a>}</div>
    {sorted.length ? <div className="product-grid catalog-grid">{sorted.map(product=><ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><Search size={32}/><h2>Bu seçimde ürün bulunamadı.</h2><p>Farklı bir kelime deneyin veya tüm ürünleri inceleyin.</p><a className="button" href={catalogHref()}>Tüm ürünleri göster <ArrowRight size={18}/></a></div>}
    <p className="catalog-disclaimer">Görseller sunum önerisidir. Ürün içeriği, gramaj ve saklama bilgileri için ambalaj üzerindeki bilgileri esas alın.</p>
    <div className="catalog-bottom"><div><span className="eyebrow">HANGİ KESİMİ SEÇMELİ?</span><h2>Önce tarifinize karar verin.</h2></div><a className="text-link" href="#/rehber">Mutfak rehberine göz atın <ArrowUpRight size={20}/></a></div>
  </div>;
}

function ProductDetail({ product }: { product: CatalogProduct }) {
  const {products:catalogProducts}=useCatalog();
  const category = categoryById(product.category)!;
  const related = catalogProducts.filter(p=>p.id!==product.id).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)).slice(0,3);
  return <div className="shell page-content product-page"><nav className="breadcrumbs" aria-label="Sayfa yolu"><a href={catalogHref()}>Ürünlerimiz</a><span>/</span><a href={catalogHref(product.category)}>{category.shortName}</a><span>/</span><span aria-current="page">{product.name}</span></nav><section className="product-detail"><div className="detail-image"><img src={imagePath(product.image)} alt={`${product.name} için sunum önerisi`} width="700" height="700"/><span>Sunum önerisi</span></div><div className="detail-copy"><a className="eyebrow" href={catalogHref(product.category)}>{category.name}</a><h1>{product.name}</h1><p className="detail-summary">{product.summary}</p><p>{product.description}</p><PurchaseOptions key={product.id} product={product} detail/><p className="shop-price-note">Tahmini fiyat. Şu anda online sipariş ve ödeme alınmıyor.</p><dl className="product-specs"><div><dt>Kesim / ürün grubu</dt><dd>{product.cut}</dd></div><div><dt>Hazırlama önerisi</dt><dd>{product.methods.map(method=><a href={`#/rehber?yontem=${guides.find(g=>g.name===method)?.id||'tava'}`} key={method}>{method}<ArrowUpRight size={12}/></a>)}</dd></div></dl><div className="product-guidance"><Utensils size={21}/><p>Bu ürünü sofranıza nasıl taşırsınız?<br/><a href={`#/rehber?yontem=${guides.find(g=>g.name===product.methods[0])?.id||'tava'}`}>Hazırlama fikirlerini keşfedin <ArrowRight size={15}/></a></p></div><p className="detail-note">İçerik, alerjen, gramaj ve saklama koşulları ürün ambalajında yer alır. Katalog görselleri sunum önerisidir.</p><a className="text-link" href={catalogHref(product.category)}><ArrowLeft size={17}/> {category.shortName} ürünlerine dön</a></div></section><section className="related-section"><div className="section-heading"><div><span className="eyebrow">KEŞFETMEYE DEVAM EDİN</span><h2>Sofraya başka ne yakışır?</h2></div><a className="text-link" href={catalogHref()}>Tüm ürünler <ArrowRight size={18}/></a></div><div className="product-grid related-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section></div>;
}

function Guide({ method }: {method: string}) {
  const {products:catalogProducts}=useCatalog();
  const guide = guides.find(g=>g.id===method)||guides[0];
  const products = catalogProducts.filter(p=>p.methods.some(method=>method===guide.name)).slice(0,4);
  return <div className="shell page-content"><div className="page-intro"><div><span className="eyebrow">ÖZLEMCE MUTFAK REHBERİ</span><h1>İlhamı seçin.<br/><em>Sofrayı kurun.</em></h1></div><p>Bir kesim, farklı hazırlama biçimleri.<br/>Mutfağınıza uygun başlangıcı bulun.</p></div><nav className="guide-tabs" aria-label="Hazırlama yöntemi">{guides.map(g=><a href={`#/rehber?yontem=${g.id}`} key={g.id} aria-current={g.id===guide.id?'page':undefined}><Flame size={18}/>{g.name}<ArrowUpRight size={16}/></a>)}</nav><section className="guide-feature"><div className="guide-photo"><img src={imagePath(guide.image)} alt={`${guide.name} için et sunumu`} width="700" height="700"/></div><div className="guide-copy"><span className="eyebrow">{guide.name} NOTLARI</span><h2>{guide.title}</h2><p>{guide.text}</p><div className="guide-tip"><span>KÜÇÜK BİR MUTFAK NOTU</span><p>{guide.tip}</p></div></div></section><section className="guide-products"><div className="section-heading"><div><span className="eyebrow">BU YÖNTEME YAKIŞANLAR</span><h2>{guide.name} için seçkimiz.</h2></div><a className="text-link" href={catalogHref('all',guide.name)}>Tümünü incele <ArrowRight size={18}/></a></div><div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></section><p className="catalog-disclaimer">Hazırlama ve saklamada ürün ambalajındaki talimatları izleyin. Çiğ ve pişmiş ürünler için ayrı ekipman kullanın; pişme durumunu uygun bir gıda termometresiyle kontrol edin.</p></div>;
}

function About() {
  return <div className="shell page-content"><div className="page-intro"><div><span className="eyebrow">ÖZLEMCE ET ENTEGRE TESİSİ</span><h1>Sofrada bir yer.<br/><em>Her gün, yeniden.</em></h1></div><p>Gündelik bir yemek, hafta sonu buluşması,<br/>özenle hazırlanan bir davet.</p></div><div className="about-image"><img src={imagePath('sofra')} alt="Paylaşmak için hazırlanan yemek sofrası" width="1400" height="700"/></div><section className="about-story"><span className="eyebrow">ÖZLEMCE İLE KEŞFEDİN</span><div><h2>İyi yemek, iyi bir<br/>seçimle başlar.</h2><p>Özlemce ürün kataloğu; dana ve kuzu kesimlerinden köfteye, şarküteriden dönere uzanan bir seçkiyi bir araya getiriyor. Amacımız, hazırlamak istediğiniz yemeğe uygun ürünü kolayca bulmanıza yardımcı olmak.</p><p>Her ürünün kendine özgü bir dokusu, her sofranın ayrı bir hikâyesi var. Ürün sayfalarındaki kesim bilgileri ve mutfak rehberimizle kendi sofranızın başlangıcını keşfedin.</p><a className="button" href={catalogHref()}>Özlemce seçkisini keşfedin <ArrowUpRight size={19}/></a></div></section><div className="about-principles">{[{n:'01',t:'Sofraya göre seçim',d:'Günlük tariflerden özel buluşmalara uzanan ürün grupları.'},{n:'02',t:'Kesimi tanıyın',d:'Ürünlerin dokusunu ve kullanım alanlarını bir arada keşfedin.'},{n:'03',t:'Mutfaktan ilham',d:'Seçtiğiniz ürüne uygun hazırlama ve sunum fikirleri.'}].map(p=><div key={p.n}><span>{p.n}</span><h3>{p.t}</h3><p>{p.d}</p></div>)}</div></div>;
}

function Help() {
  const questions = [
    ['Online sipariş verebilir miyim?','Ürünleri gramajını seçerek sepetinize ekleyebilirsiniz. Fiyatlar tahmini tutarlardır. Şu anda site üzerinden sipariş veya ödeme alınmıyor; sepet bir sipariş oluşturmaz.'],
    ['Aradığım ürünü nasıl bulabilirim?','Ürünlerimiz sayfasında kategori seçebilir, ürün adı veya “ızgara”, “tava” gibi hazırlama yöntemleriyle arama yapabilirsiniz.'],
    ['Ürün içerik ve alerjen bilgilerini nereden öğrenebilirim?','En güncel içerik, alerjen, gramaj, son tüketim tarihi ve saklama bilgileri için satın aldığınız ürünün ambalajını esas alın. Katalog görselleri sunum önerisidir.'],
    ['Restoranlar için ürün var mı?','Katalogdaki Profesyonel Mutfak kategorisinde toplu tüketim için oluşturulan seçkiyi inceleyebilirsiniz. Bu site üzerinden teklif veya sipariş alınmıyor.'],
  ];
  return <div className="shell page-content reading-page"><span className="eyebrow">KATALOG HAKKINDA</span><h1>Merak ettikleriniz.</h1><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={20}/></summary><p>{a}</p></details>)}</div><a className="text-link" href={catalogHref()}>Ürün kataloğuna dön <ArrowRight size={18}/></a></div>;
}

function Privacy() {
  return <div className="shell page-content reading-page"><span className="eyebrow">SİTE KULLANIMI</span><h1>Gizlilik hakkında.</h1><div className="reading-copy"><h2>Sade bir katalog deneyimi</h2><p>Ürün kataloğunu incelemek için üyelik gerekmez. Katalogda sipariş veya ödeme bilgisi toplanmaz.</p><h2>Yönetici girişi ve içerik yönetimi</h2><p>İçerik yönetimi yalnızca yetkilendirilmiş ChatGPT hesabına açıktır. Giriş Sites üzerinden doğrulanır; site şifre saklamaz. Ürünler ve içerikler sunucudaki veritabanında tutulur. Yüklenen katalog görselleri herkese açık bağlantılarla sunulur. Oturum çerezleri, güvenli girişin çalışması için kullanılır.</p><h2>Arama ve tercihler</h2><p>Katalog aramaları tarayıcınızda işlenir. Aradığınız kelime ve seçtiğiniz kategori, sayfanın bağlantısındaki # işaretinden sonraki bölümde tutulur. Sepet ve favoriler yalnızca bu tarayıcının yerel depolamasında saklanır; başka cihazlarla eşitlenmez. Tarayıcı site verilerini silerek bu seçimleri kaldırabilirsiniz. Site, reklam veya analiz çerezi kullanmaz.</p><h2>Barındırma</h2><p>Site OpenAI Sites üzerinde barındırılır. Barındırma hizmeti güvenlik ve işletim amacıyla teknik bağlantı bilgilerini işleyebilir. Ayrıntılar için <a href="https://openai.com/policies/privacy-policy/" target="_blank" rel="noopener noreferrer">OpenAI Gizlilik Politikası’nı</a> inceleyebilirsiniz.</p></div></div>;
}

function NotFound() {return <div className="shell empty-state not-found"><span className="eyebrow">404 / SAYFA BULUNAMADI</span><h1>Bu sayfa sofrada yok.</h1><p>Ürün kataloğundan keşfetmeye devam edebilirsiniz.</p><a className="button" href={catalogHref()}>Ürünlerimizi keşfedin <ArrowRight size={18}/></a></div>;}

function Footer() {
  return <footer className="site-footer"><div className="shell"><div className="footer-main"><div className="footer-brand"><a href={homeHref} aria-label="Özlemce ana sayfa"><OzlemceLogo size="lg"/></a><p>Özenli seçimler.<br/>Paylaşılan sofralar.</p></div><div className="footer-column"><h2>Ürünlerimiz</h2>{catalogCategories.slice(0,4).map(c=><a key={c.id} href={catalogHref(c.id)}>{c.name}</a>)}</div><div className="footer-column"><h2>Keşfedin</h2><a href={catalogHref('charcuterie')}>Şarküteri</a><a href={catalogHref('doner')}>Döner</a><a href={catalogHref('horeca')}>Profesyonel mutfak</a><a href="#/rehber">Mutfak rehberi</a></div><div className="footer-column"><h2>Özlemce</h2><a href="#/hakkimizda">Hakkımızda</a><a href="#/yardim">Sık sorulan sorular</a><a href="#/gizlilik">Gizlilik</a><a href="#/yonetim">Yönetim</a><a className="footer-back" href={homeHref}>Ana sayfaya dön <ArrowUpRight size={15}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Özlemce Et Entegre Tesisi</span><span>Ürün kataloğu <span className="footer-dot">·</span> Sofranıza ilham verir.</span></div></div></footer>;
}

function Storefront() {
  const {products:catalogProducts}=useCatalog();
  const [hash, setHash] = useState(window.location.hash);
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef<string | null>(null);
  const { path, params } = readRoute(hash);
  const product = path.startsWith('urun/') ? catalogProducts.find(p=>p.id===path.slice(5)) : undefined;
  useEffect(()=>{const change=()=>setHash(window.location.hash);window.addEventListener('hashchange',change);return ()=>window.removeEventListener('hashchange',change);},[]);
  useEffect(()=>{
    const title = product?.name || ({'ana-sayfa':'Özenli seçimler, paylaşılan sofralar','urunler':'Ürün kataloğu','rehber':'Mutfak rehberi','hakkimizda':'Hakkımızda','yardim':'Sık sorulan sorular','gizlilik':'Gizlilik','favoriler':'Favorilerim'} as Record<string,string>)[path] || 'Sayfa bulunamadı';
    document.title = `${title} | Özlemce Et Entegre Tesisi`;
    document.querySelector('meta[name="description"]')?.setAttribute('content',product?.description || 'Özlemce ürün kataloğu. Dana ve kuzu kesimleri, köfte, şarküteri ve döner seçeneklerini keşfedin; mutfak rehberinden ilham alın.');
    const previous = previousPath.current;
    previousPath.current = path;
    if(previous === null || (path === 'urunler' && previous === path)) return;
    window.scrollTo({top:0,behavior:'instant'});
    mainRef.current?.focus({preventScroll:true});
  },[hash,path,product]);
  let content;
  if(path==='ana-sayfa') content=<Home/>;
  else if(path==='urunler') content=<Catalog category={params.get('kategori')||'all'} query={params.get('ara')||''}/>;
  else if(path==='favoriler') content=<Favorites/>;
  else if(product) content=<ProductDetail product={product}/>;
  else if(path==='rehber') content=<Guide method={params.get('yontem')||'izgara'}/>;
  else if(path==='hakkimizda') content=<About/>;
  else if(path==='yardim') content=<Help/>;
  else if(path==='gizlilik') content=<Privacy/>;
  else content=<NotFound/>;
  return <div className="storefront"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();mainRef.current?.focus();}}>İçeriğe geç</a><Header hash={hash}/><main id="main-content" ref={mainRef} tabIndex={-1} data-route={path}>{content}</main><Footer/></div>;
}

export default function App() {
  const [hash,setHash]=useState(window.location.hash);
  const currentHash=useRef(hash);currentHash.current=hash;
  const dirty=useRef(false);
  const onDirtyChange=useCallback((value:boolean)=>{dirty.current=value;},[]);
  useEffect(()=>{const change=()=>{
    const next=window.location.hash;
    if(dirty.current&&!['yonetim','admin'].includes(readRoute(next).path)) {
      if(!window.confirm('Kaydedilmemiş değişiklikleriniz var. Yönetimden ayrılmak istiyor musunuz?')) {
        window.history.replaceState(null,'',window.location.pathname+window.location.search+currentHash.current);return;
      }
      dirty.current=false;
    }
    setHash(next);
  };window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
  if(['yonetim','admin'].includes(readRoute(hash).path)) return <Suspense fallback={<div className="catalog-connection" role="status">Yönetim yükleniyor…</div>}><AdminApp onDirtyChange={onDirtyChange}/></Suspense>;
  return <CatalogProvider><ShopProvider><Storefront/></ShopProvider></CatalogProvider>;
}
