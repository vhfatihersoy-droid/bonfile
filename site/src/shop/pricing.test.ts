import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogProducts } from '../data/catalog';
import { documentSchema, initialDocument } from '../cms/model';
import { cleanCart, packageCents, weightGrams } from './pricing';

test('Turkish decimal weights and exact package prices',()=>{
  assert.equal(weightGrams('2,5 kg'),2500);
  assert.equal(weightGrams('480 g'),480);
  for(const value of ['-1 kg','0 g','500','NaN kg','1 kg extra','101 kg'])assert.equal(weightGrams(value),null);
  const product={...catalogProducts[0],pricePerKg:2400};
  assert.equal(packageCents(product,'500 g'),120000);
  assert.equal(packageCents(product,'2,5 kg'),600000);
  assert.equal(packageCents(product,'2 kg'),null);
  assert.equal(packageCents({...product,pricePerKg:null},'500 g'),null);
  assert.equal(packageCents({...catalogProducts[8],pricePerKg:1200},'480 g'),57600);
});
test('legacy catalog gets estimates without losing content; explicit cleared and custom prices persist',()=>{
  const legacy=structuredClone(initialDocument);
  legacy.products.forEach(p=>delete (p as {pricePerKg?:number|null}).pricePerKg);
  legacy.home.heroTitle='Yönetici tarafından düzenlenen başlık';
  const parsed=documentSchema.parse(legacy);
  assert.equal(parsed.products[0].pricePerKg,2400);
  assert.equal(parsed.home.heroTitle,legacy.home.heroTitle);
  parsed.products[0].pricePerKg=null;
  parsed.products[1].pricePerKg=1875.5;
  const again=documentSchema.parse(parsed);
  assert.equal(again.products[0].pricePerKg,null);
  assert.equal(again.products[1].pricePerKg,1875.5);
  for(const invalid of [-10,0,Infinity,1000001]){parsed.products[0].pricePerKg=invalid;assert.equal(documentSchema.safeParse(parsed).success,false);}
});
test('stored cart rejects unavailable products, removed weights, invalid quantities and disabled pricing',()=>{
  const product={...catalogProducts[0],pricePerKg:2400};
  const one={productId:product.id,weight:'500 g',quantity:1};
  const data=[one,one,{...one,quantity:99},{...one,quantity:100},{...one,quantity:1.5},{...one,quantity:-1},{...one,weight:'250 g'},{...one,productId:'deleted'},null];
  assert.deepEqual(cleanCart(data,[product]),[{...one,quantity:99}]);
  assert.deepEqual(cleanCart(data,[]),[]);
  assert.deepEqual(cleanCart(data,[{...product,pricePerKg:null}]),[]);
  assert.deepEqual(cleanCart('invalid',[product]),[]);
});
