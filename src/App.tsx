import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Flame, Menu, Search, Utensils, X } from 'lucide-react';
import { OzlemceLogo } from './components/OzlemceLogo';
import { catalogCategories, categoryById, imagePath, type CatalogProduct } from './data/catalog';
import { catalogHref, filterCatalog, readRoute } from './lib/catalog';

import { CatalogProvider, useCatalog } from './cms/CatalogContext';
const AdminApp = lazy(() => import('./cms/AdminApp'));

const productHref = (id: string) => `#/urun/${id}`;
const homeHref = '#/ana-sayfa';
const guides = [
  {id:'izgara', name:'Izgara', title:'Ateşin etrafında buluşalım.', text:'Antrikot, pirzola ve köfte; ızgara sofralarının farklı karakterleri. Benzer kalınlıktaki parçaları birlikte hazırlayın, servis tabağını önceden planlayın.', tip:'Etin yanında közlenmiş mevsim sebzelerine ve taze bir salataya yer açın.', image:'izgara'},
  {id:'tava', name:'Tava', title:'Bir tava, pek çok olasılık.', text:'Bonfileden burger köftesine, tavada hazırlayabileceğiniz ürünleri keşfedin. Tavayı önceden ısıtın ve malzemeleri tek sıra halinde yerleştirebileceğiniz bir boyut seçin.', tip:'Tavayı fazla doldurmamak, etin yüzeyinin dengeli pişmesine yardımcı olur.', image:'steak'},
  {id:'firin', name:'Fırın', title:'Sofraya biraz zaman ayırın.', text:'Kuzu incik ve pirzola ile fırın tariflerine yer açın. Pişirme kabını, süreyi ve hazırlık yöntemini seçtiğiniz kesime göre belirleyin.', tip:'Kök sebzeler ve taze otlar, fırın yemeklerine güzel bir eşlikçi olur.', image:'kuzu'},
  {id:'tencere', name:'Tencere', title:'Birlikte pişen lezzetler.', text:'Kuşbaşı ve incik; güveçlerden sebzeli tencere yemeklerine uzanan tariflerin başlangıcı. Benzer boyutta doğranmış malzemelerle hazırlığınızı kolaylaştırın.', tip:'Sebzelerin farklı pişme sürelerini göz önünde bulundurarak tencereye ekleyin.', image:'bonfile'},
];

function ProductCard({ product }: { product: CatalogProduct }) {
  return <a className="product-card" href={productHref(product.id)}>
    <div className="product-photo"><img src={imagePath(product.image)} alt={`${product.name} için sunum önerisi`} loading="lazy" width="700" height="700" /><span className="product-arrow"><ArrowUpRight size={21}/></span></div>
    <div className="product-copy"><span className="eyebrow">{categoryById(product.category)?.shortName}</span><h3>{product.name}</h3><p>{product.summary}</p></div>
  </a>;
}

function Header({ hash }: { hash: string }) {
  const { path } = readRoute(hash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [hash]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } }
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  function search(event: FormEvent) { event.preventDefault(); window.location.hash = catalogHref('all', query); setSearchOpen(false); setMenuOpen(false); }
  const links = [{href:catalogHref(),label:'Ürünlerimiz',active:path.startsWith('urun')},{href:'#/rehber',label:'Mutfak rehberi',active:path==='rehber'},{href:'#/hakkimizda',label:'Özlemce hakkında',active:path==='hakkimizda'}];
  return <>
    <div className="top-note"><div className="shell"><span>ÖZENLE SEÇİN. KEYİFLE HAZIRLAYIN.</span><span>Özlemce Et Entegre Tesisi</span></div></div>
    <header className="site-header"><div className="shell header-inner">
      <a className="brand-link" href={homeHref} aria-label="Özlemce ana sayfa"><OzlemceLogo size="lg"/></a>
      <nav className="desktop-nav" aria-label="Ana menü">{links.map(link=><a key={link.href} href={link.href} aria-current={link.active?'page':undefined}>{link.label}</a>)}</nav>
      <div className="header-actions"><button className="icon-button" aria-label={searchOpen?'Aramayı kapat':'Ürün ara'} aria-expanded={searchOpen} aria-controls="header-search" onClick={()=>{setSearchOpen(!searchOpen);setMenuOpen(false);}}>{searchOpen?<X size={22}/>:<Search size={21}/>}</button><a className="button small header-cta" href={catalogHref()}>Kataloğu keşfet <ArrowUpRight size={17}/></a><button className="icon-button mobile-menu-toggle" aria-label={menuOpen?'Menüyü kapat':'Menüyü aç'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={()=>{setMenuOpen(!menuOpen);setSearchOpen(false);}}>{menuOpen?<X/>:<Menu/>}</button></div>
    </div>
    {searchOpen && <div id="header-search" className="search-panel"><form className="shell" role="search" onSubmit={search}><Search size={21}/><label className="sr-only" htmlFor="global-search">Katalogda ara</label><input id="global-search" ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Bonfile, köfte, ızgara…" maxLength={100}/><button className="button small" type="submit">Ara <ArrowRight size={16}/></button></form></div>}
    {menuOpen && <nav id="mobile-nav" className="mobile-nav shell" aria-label="Mobil menü">{links.map(link=><a key={link.href} href={link.href} aria-current={link.active?'page':undefined}>{link.label}<ArrowUpRight size={19}/></a>)}</nav>}
    </header>
  </>;
}

export function Home() {
  const {home, products:catalogProducts}=useCatalog();
  return <>
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-line"/> {home.heroEyebrow}</span><h1 id="hero-title">{home.heroTitle}<br/><em>{home.heroAccent}</em></h1><p>{home.heroDescription}</p><div className="hero-actions"><a className="button" href={catalogHref()}>{home.heroButton} <ArrowUpRight size={20}/></a><a className="text-link" href="#/rehber">Mutfaktan ilham alın <ArrowRight size={17}/></a></div><div className="hero-footnote"><span>01 / ÖZLEMCE SEÇKİSİ</span><a href="#kategoriler" onClick={e=>{e.preventDefault();document.getElementById('kategoriler')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}} aria-label="Ürün kategorilerine ilerle"><ArrowDown size={18}/></a></div></div>
      <div className="hero-visual"><img src={imagePath(home.heroImage)} alt={home.heroImageAlt} fetchPriority="high" width="1400" height="1400"/><div className="hero-image-shade"/><div className="image-top-label"><span className="status-dot"/> ÖZLEMCE MUTFAĞINDAN</div><div className="hero-caption"><div><span>HER SOFRAYA BİR SEÇİM</span><h2>{home.heroCaption}</h2></div><a href={catalogHref('steak')} className="circle-link" aria-label="Steak ve özel kesimleri keşfedin"><ArrowUpRight size={25}/></a></div></div>
    </section>
    <section id="kategoriler" className="category-section shell" aria-labelledby="category-title"><div className="section-heading compact"><div><span className="eyebrow">NE HAZIRLAMAK İSTERSİNİZ?</span><h2 id="category-title">{home.categoriesTitle}</h2></div><a className="text-link" href={catalogHref()}>Tüm ürünler <ArrowRight size={18}/></a></div><div className="category-grid">{catalogCategories.slice(0,6).map((category,i)=><a className="category-tile" href={catalogHref(category.id)} key={category.id}><div className="category-image"><img src={imagePath(category.image)} alt="" loading="lazy" width="160" height="160"/></div><span className="category-number">0{i+1}</span><h3>{category.shortName}</h3><ArrowUpRight size={18}/></a>)}</div></section>
    <section className="featured-section"><div className="shell"><div className="section-heading"><div><span className="eyebrow">ÖZLEMCE SEÇKİSİ</span><h2>{home.featuredTitle}</h2></div><p>{home.featuredDescription}</p></div><div className="product-grid featured-grid">{home.featuredIds.flatMap(id=>{const product=catalogProducts.find(p=>p.id===id);return product?[<ProductCard key={id} product={product}/>]:[];})}</div></div></section>
    <section className="editorial shell"><div className="editorial-photo"><img src={imagePath(home.editorialImage)} alt={home.editorialImageAlt} loading="lazy" width="700" height="700"/><span className="photo-caption">MUTFAK NOTLARI / 01</span></div><div className="editorial-copy"><span className="eyebrow">{home.editorialEyebrow}</span><h2>{home.editorialTitle}<br/><em>{home.editorialAccent}</em></h2><p>{home.editorialDescription}</p><a className="button light" href="#/rehber">{home.editorialButton} <ArrowUpRight size={19}/></a></div></section>
    <section className="brand-note shell"><span className="eyebrow">ÖZLEMCE ET ENTEGRE TESİSİ</span><h2>{home.brandTitle}<br/><em>{home.brandAccent}</em></h2><a className="text-link" href="#/hakkimizda">Özlemce’yi tanıyın <ArrowRight size={18}/></a></section>
  </>;
}

function Catalog({ category, query }: { category: string; query: string }) {
  const {products:catalogProducts}=useCatalog();
  const [search, setSearch] = useState(query);
  const [sort, setSort] = useState('selection');
  useEffect(()=>{setSearch(query);},[query]);
  const validCategory = categoryById(category) ? category : 'all';
  const products = filterCatalog(catalogProducts, validCategory, query);
  const sorted = sort==='name' ? [...products].sort((a,b)=>a.name.localeCompare(b.name,'tr')) : products;
  function submit(event: FormEvent) {event.preventDefault();window.location.hash=catalogHref(validCategory,search);}
  return <div className="shell page-content"><div className="page-intro"><div><span className="eyebrow">ÖZLEMCE ÜRÜN KATALOĞU</span><h1>Sofranız için<br/><em>doğru seçim.</em></h1></div><p>Kesimleri keşfedin, hazırlama yöntemlerini inceleyin.<br/>Bir sonraki tarifiniz için ilham bulun.</p></div>
    <div className="catalog-tools"><form className="catalog-search" onSubmit={submit} role="search"><Search size={19}/><label className="sr-only" htmlFor="catalog-search">Ürün veya pişirme yöntemi ara</label><input id="catalog-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün veya pişirme yöntemi ara" maxLength={100}/><button type="submit" aria-label="Katalogda ara"><ArrowRight size={20}/></button></form><label className="sort-label">Sırala <select value={sort} onChange={e=>setSort(e.target.value)}><option value="selection">Özlemce seçkisi</option><option value="name">İsme göre A–Z</option></select><ChevronDown size={15}/></label></div>
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
  return <div className="shell page-content product-page"><nav className="breadcrumbs" aria-label="Sayfa yolu"><a href={catalogHref()}>Ürünlerimiz</a><span>/</span><a href={catalogHref(product.category)}>{category.shortName}</a><span>/</span><span aria-current="page">{product.name}</span></nav><section className="product-detail"><div className="detail-image"><img src={imagePath(product.image)} alt={`${product.name} için sunum önerisi`} width="700" height="700"/><span>Sunum önerisi</span></div><div className="detail-copy"><a className="eyebrow" href={catalogHref(product.category)}>{category.name}</a><h1>{product.name}</h1><p className="detail-summary">{product.summary}</p><p>{product.description}</p><dl className="product-specs"><div><dt>Kesim / ürün grubu</dt><dd>{product.cut}</dd></div><div><dt>Hazırlama önerisi</dt><dd>{product.methods.map(method=><a href={`#/rehber?yontem=${guides.find(g=>g.name===method)?.id||'tava'}`} key={method}>{method}<ArrowUpRight size={12}/></a>)}</dd></div></dl><div className="product-guidance"><Utensils size={21}/><p>Bu ürünü sofranıza nasıl taşırsınız?<br/><a href={`#/rehber?yontem=${guides.find(g=>g.name===product.methods[0])?.id||'tava'}`}>Hazırlama fikirlerini keşfedin <ArrowRight size={15}/></a></p></div><p className="detail-note">İçerik, alerjen, gramaj ve saklama koşulları ürün ambalajında yer alır. Katalog görselleri sunum önerisidir.</p><a className="text-link" href={catalogHref(product.category)}><ArrowLeft size={17}/> {category.shortName} ürünlerine dön</a></div></section><section className="related-section"><div className="section-heading"><div><span className="eyebrow">KEŞFETMEYE DEVAM EDİN</span><h2>Sofraya başka ne yakışır?</h2></div><a className="text-link" href={catalogHref()}>Tüm ürünler <ArrowRight size={18}/></a></div><div className="product-grid related-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section></div>;
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
    ['Online sipariş verebilir miyim?','Bu sitede Özlemce ürün kataloğunu inceleyebilirsiniz. Şu anda site üzerinden sipariş veya ödeme alınmıyor.'],
    ['Aradığım ürünü nasıl bulabilirim?','Ürünlerimiz sayfasında kategori seçebilir, ürün adı veya “ızgara”, “tava” gibi hazırlama yöntemleriyle arama yapabilirsiniz.'],
    ['Ürün içerik ve alerjen bilgilerini nereden öğrenebilirim?','En güncel içerik, alerjen, gramaj, son tüketim tarihi ve saklama bilgileri için satın aldığınız ürünün ambalajını esas alın. Katalog görselleri sunum önerisidir.'],
    ['Restoranlar için ürün var mı?','Katalogdaki Profesyonel Mutfak kategorisinde toplu tüketim için oluşturulan seçkiyi inceleyebilirsiniz. Bu site üzerinden teklif veya sipariş alınmıyor.'],
  ];
  return <div className="shell page-content reading-page"><span className="eyebrow">KATALOG HAKKINDA</span><h1>Merak ettikleriniz.</h1><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={20}/></summary><p>{a}</p></details>)}</div><a className="text-link" href={catalogHref()}>Ürün kataloğuna dön <ArrowRight size={18}/></a></div>;
}

function Privacy() {
  return <div className="shell page-content reading-page"><span className="eyebrow">SİTE KULLANIMI</span><h1>Gizlilik hakkında.</h1><div className="reading-copy"><h2>Sade bir katalog deneyimi</h2><p>Ürün kataloğunu incelemek için üyelik gerekmez. Katalogda sipariş veya ödeme bilgisi toplanmaz.</p><h2>Yönetici girişi ve içerik yönetimi</h2><p>Yalnızca yetkili yöneticiler e-posta doğrulaması ve doğrulayıcı uygulamasıyla giriş yapabilir. Giriş, içerik kayıtları ve yüklenen görseller Supabase üzerinden işlenir. Oturum bilgisi sekme oturumu boyunca tarayıcıda saklanır. Yüklenen katalog görselleri herkese açık sunulur. Ayrıntılar için <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Gizlilik Politikası’nı</a> inceleyebilirsiniz.</p><h2>Arama ve tercihler</h2><p>Katalog aramaları tarayıcınızda işlenir. Aradığınız kelime ve seçtiğiniz kategori, sayfanın bağlantısındaki # işaretinden sonraki bölümde tutulur. Site, reklam veya analiz çerezi kullanmaz.</p><h2>Barındırma</h2><p>Site GitHub Pages üzerinde barındırılır. Siteye erişiminiz sırasında barındırma hizmeti güvenlik ve işletim amacıyla teknik bağlantı bilgilerini işleyebilir. Ayrıntılar için <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Gizlilik Bildirimi’ni</a> inceleyebilirsiniz.</p></div></div>;
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
    const title = product?.name || ({'ana-sayfa':'Özenli seçimler, paylaşılan sofralar','urunler':'Ürün kataloğu','rehber':'Mutfak rehberi','hakkimizda':'Hakkımızda','yardim':'Sık sorulan sorular','gizlilik':'Gizlilik'} as Record<string,string>)[path] || 'Sayfa bulunamadı';
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
  return <CatalogProvider><Storefront/></CatalogProvider>;
}
