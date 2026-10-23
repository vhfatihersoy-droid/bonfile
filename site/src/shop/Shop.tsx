import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Heart, ShoppingBag, Plus, Minus, X, Trash2, ArrowRight, Check } from 'lucide-react';
import { useCatalog } from '../cms/CatalogContext';
import { categoryById, imagePath, type CatalogProduct } from '../data/catalog';
import { cartKey, cleanCart, money, packageCents, pricePerKg, type CartItem } from './pricing';

const CART='ozlemce.cart.v1', FAVORITES='ozlemce.favorites.v1';
const read=(key:string):unknown=>{try{return JSON.parse(localStorage.getItem(key)||'[]');}catch{return [];}};
interface ShopState {items:CartItem[]; favorites:string[]; add:(product:CatalogProduct,weight:string)=>void; toggle:(id:string)=>void; open:()=>void}
const ShopContext=createContext<ShopState>({items:[],favorites:[],add:()=>{},toggle:()=>{},open:()=>{}});
export const useShop=()=>useContext(ShopContext);
export function ShopProvider({children}:{children:ReactNode}) {
  const {products}=useCatalog();
  const [items,setItems]=useState<CartItem[]>(()=>cleanCart(read(CART),products));
  const [favorites,setFavorites]=useState<string[]>(()=>{const data=read(FAVORITES);return Array.isArray(data)?[...new Set(data.filter((id):id is string=>typeof id==='string'&&products.some(p=>p.id===id)))].slice(0,300):[];});
  const [isOpen,setOpen]=useState(false);
  const [notice,setNotice]=useState('');
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{try{localStorage.setItem(CART,JSON.stringify(items));localStorage.setItem(FAVORITES,JSON.stringify(favorites));}catch{}},[items,favorites]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),3000);return()=>clearTimeout(timer);},[notice]);
  useEffect(()=>{const element=dialog.current;if(!element)return;if(isOpen){element.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{element.close();document.body.style.overflow=previous;};}},[isOpen]);
  function add(product:CatalogProduct,weight:string) {if(packageCents(product,weight)===null)return;setItems(previous=>cleanCart([...previous,{productId:product.id,weight,quantity:1}],products));setNotice(`${product.name} · ${weight} sepete eklendi.`);}
  function toggle(id:string){setFavorites(previous=>previous.includes(id)?previous.filter(value=>value!==id):[...previous,id]);}
  function change(item:CartItem,delta:number){setItems(previous=>previous.flatMap(line=>cartKey(line)===cartKey(item)?(line.quantity+delta>0?[{...line,quantity:Math.min(99,line.quantity+delta)}]:[]):[line]));}
  const lines=cleanCart(items,products).map(item=>({item,product:products.find(p=>p.id===item.productId)!}));
  const total=lines.reduce((sum,{item,product})=>sum+packageCents(product,item.weight)!*item.quantity,0);
  return <ShopContext.Provider value={{items,favorites,add,toggle,open:()=>setOpen(true)}}>{children}
    <div className={`shop-toast ${notice?'shown':''}`} role="status" aria-live="polite">{notice&&<><Check size={18}/><span>{notice}</span><button onClick={()=>setOpen(true)}>Sepeti gör</button></>}</div>
    <dialog ref={dialog} className="cart-dialog" aria-labelledby="cart-title" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget){const bounds=e.currentTarget.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)setOpen(false);}}}>
      <div className="cart-heading"><div><span className="eyebrow">ÖZLEMCE SEÇİMLERİNİZ</span><h2 id="cart-title">Sepetim <small>({items.reduce((n,i)=>n+i.quantity,0)})</small></h2></div><button className="icon-button" aria-label="Sepeti kapat" onClick={()=>setOpen(false)} autoFocus><X/></button></div>
      {lines.length?<><div className="cart-lines">{lines.map(({item,product})=><article className="cart-line" key={cartKey(item)}><img src={imagePath(product.image)} alt=""/><div><a href={`#/urun/${product.id}`} onClick={()=>setOpen(false)}><h3>{product.name}</h3></a><p>{item.weight} · {money(packageCents(product,item.weight)!)} / paket</p><div className="cart-quantity"><button aria-label={`${product.name} adedini azalt`} onClick={()=>change(item,-1)}><Minus size={15}/></button><span aria-label="Adet">{item.quantity}</span><button aria-label={`${product.name} adedini artır`} disabled={item.quantity>=99} onClick={()=>change(item,1)}><Plus size={15}/></button></div></div><div className="cart-line-total"><strong>{money(packageCents(product,item.weight)!*item.quantity)}</strong><button aria-label={`${product.name} sepetten kaldır`} onClick={()=>setItems(previous=>previous.filter(line=>cartKey(line)!==cartKey(item)))}><Trash2 size={16}/></button></div></article>)}</div><div className="cart-summary"><div><span>Tahmini toplam</span><strong>{money(total)}</strong></div><p>Fiyatlar yaklaşık bilgilendirme tutarlarıdır. Şu anda sipariş ve ödeme alınmıyor. Sepetiniz yalnızca bu tarayıcıda saklanır.</p><button className="button" onClick={()=>setOpen(false)}>Ürünlere devam et <ArrowRight size={18}/></button></div></>:<div className="cart-empty"><ShoppingBag size={48} strokeWidth={1}/><h3>Sofranız için bir başlangıç.</h3><p>Beğendiğiniz ürünleri gramajını seçerek sepetinize ekleyin.</p><a className="button" href="#/urunler" onClick={()=>setOpen(false)}>Ürünleri keşfet <ArrowRight size={18}/></a></div>}
    </dialog>
  </ShopContext.Provider>;
}

export function PurchaseOptions({product,detail=false}:{product:CatalogProduct;detail?:boolean}) {
  const {add}=useShop();
  const [selected,setSelected]=useState(product.weights[0]||'');
  const weight=product.weights.includes(selected)?selected:product.weights[0]||'';
  const cents=packageCents(product,weight), kg=pricePerKg(product);
  return <div className={`purchase-options ${detail?'purchase-detail':''}`}><div className="purchase-price"><span>Tahmini fiyat</span><strong>{cents!==null?money(cents):'Fiyat belirtilmedi'}</strong><small>{kg!==null?`${money(kg*100)} / kg`:'Gramaj ve fiyat bilgisi yakında'}</small></div><label className="weight-picker"><span className={detail?'':'sr-only'}>{product.name} gramaj</span><select aria-label={`${product.name} gramaj`} value={weight} onChange={e=>setSelected(e.target.value)} disabled={!product.weights.length}>{product.weights.length?product.weights.map(w=><option key={w} value={w}>{w}</option>):<option>Gramaj belirtilmedi</option>}</select></label><button className="add-cart" disabled={cents===null} onClick={()=>add(product,weight)} aria-label={`${product.name} sepete ekle`}><Plus size={17}/><span>Sepete ekle</span></button></div>;
}
export function ProductCard({product}:{product:CatalogProduct}) {
  const {favorites,toggle}=useShop();
  const favorite=favorites.includes(product.id);
  return <article className="shop-product"><div className="shop-product-image"><a href={`#/urun/${product.id}`}><img src={imagePath(product.image)} alt={`${product.name} sunum önerisi`} loading="lazy" width="700" height="700"/></a><button className={`favorite-button ${favorite?'active':''}`} aria-pressed={favorite} aria-label={`${product.name} ${favorite?'favorilerden çıkar':'favorilere ekle'}`} onClick={()=>toggle(product.id)}><Heart size={18} fill={favorite?'currentColor':'none'}/></button><span className="photo-note">Sunum önerisi</span></div><div className="shop-product-body"><span className="eyebrow">{categoryById(product.category)?.shortName}</span><a href={`#/urun/${product.id}`}><h3>{product.name}</h3></a><p className="shop-product-summary">{product.summary}</p><PurchaseOptions product={product}/></div></article>;
}
export function Favorites() {
  const {products}=useCatalog(),{favorites}=useShop();
  const selected=products.filter(p=>favorites.includes(p.id));
  return <div className="shell page-content"><div className="section-heading"><div><span className="eyebrow">BİR SONRAKİ SOFRANIZA</span><h1>Favorilerim</h1></div><span>{selected.length} ürün</span></div>{selected.length?<div className="product-grid">{selected.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><Heart size={36}/><h2>Sevdiklerinizi burada biriktirin.</h2><p>Ürünlerdeki kalp simgesiyle kendi seçkinizi oluşturabilirsiniz.</p><a className="button" href="#/urunler">Ürünleri keşfet <ArrowRight size={18}/></a></div>}</div>;
}
