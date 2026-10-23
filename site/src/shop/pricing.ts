import type { CatalogProduct } from '../data/catalog';

// Owner-requested indicative starting values, editable in the CMS.
export const estimatedPrices: Record<string, number> = {
  'dana-bonfile-lokum':2400, 'dallas-steak':2000, 't-bone-steak':2200,
  'dana-antrikot':2100, 'kuzu-pirzola':2600, 'dana-kusbasi-marine':1250,
  'kuzu-incik-osso-buco':1300, 'efecioglu-kasap-kofte':1100,
  'gurme-smash-burger-koftesi':1200, 'kayseri-evlik-sucuk':1400,
  'dana-antrikot-pastirma':2400, 'yaprak-et-doner-pismis':1500,
  'horeca-b2b-steakhouse-koli':1300,
};
export function weightGrams(value:string):number|null {
  const match=value.trim().match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|gr)$/i);
  if(!match) return null;
  const grams=Number(match[1].replace(',','.'))*(match[2].toLowerCase()==='kg'?1000:1);
  return Number.isFinite(grams)&&grams>0&&grams<=100000 ? grams : null;
}
export function pricePerKg(product:CatalogProduct):number|null {
  const value=product.pricePerKg===undefined?estimatedPrices[product.id]:product.pricePerKg;
  return typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=1_000_000?value:null;
}
export function packageCents(product:CatalogProduct,weight:string):number|null {
  const price=pricePerKg(product), grams=weightGrams(weight);
  return price!==null&&grams!==null&&product.weights.includes(weight)?Math.round(price*100*grams/1000):null;
}
export const money=(cents:number)=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(cents/100);
export interface CartItem {productId:string;weight:string;quantity:number}
export const cartKey=(item:Pick<CartItem,'productId'|'weight'>)=>JSON.stringify([item.productId,item.weight]);
export function cleanCart(value:unknown,products:CatalogProduct[]):CartItem[] {
  if(!Array.isArray(value))return [];
  const result=new Map<string,CartItem>();
  for(const item of value.slice(0,600)) {
    if(!item||typeof item!=='object'||typeof item.productId!=='string'||typeof item.weight!=='string'||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99)continue;
    const product=products.find(p=>p.id===item.productId);
    if(!product||packageCents(product,item.weight)===null)continue;
    const key=cartKey(item), previous=result.get(key);
    result.set(key,{productId:item.productId,weight:item.weight,quantity:Math.min(99,(previous?.quantity||0)+item.quantity)});
  }
  return [...result.values()];
}
