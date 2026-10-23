import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogCategories, catalogProducts } from '../data/catalog';
import { catalogHref, filterCatalog, normalizeSearch, readRoute } from './catalog';

test('Turkish searches match both accented and plain keyboard input', () => {
  assert.equal(normalizeSearch('  KUZU PİRZOLA  '), 'kuzu pirzola');
  assert.equal(normalizeSearch('DANA KUŞBAŞI'), 'dana kusbasi');
  assert.equal(filterCatalog(catalogProducts, 'all', 'kusbasi')[0]?.name, 'Dana Kuşbaşı');
  assert.equal(filterCatalog(catalogProducts, 'all', 'KÖFTE').length, 2);
});
test('category and each search word constrain results together', () => {
  const matches = filterCatalog(catalogProducts, 'lamb', 'kuzu izgara');
  assert.deepEqual(matches.map(p=>p.id), ['kuzu-pirzola']);
  assert.equal(filterCatalog(catalogProducts, 'doner', 'bonfile').length, 0);
  assert.equal(filterCatalog(catalogProducts, 'all', '').length, catalogProducts.length);
});
test('hash URLs round trip Turkish text and reserved URL characters', () => {
  const route = readRoute(catalogHref('meatball', 'köfte & burger?'));
  assert.equal(route.path, 'urunler');
  assert.equal(route.params.get('kategori'), 'meatball');
  assert.equal(route.params.get('ara'), 'köfte & burger?');
  assert.equal(readRoute('').path, 'ana-sayfa');
  assert.equal(catalogHref('all','  '), '#/urunler');
  assert.equal(readRoute('#/admin').path, 'admin');
});
test('catalog routes are unique and all products have valid categories', () => {
  assert.equal(new Set(catalogProducts.map(p=>p.id)).size, catalogProducts.length);
  for(const product of catalogProducts) {
    assert.ok(catalogCategories.some(c=>c.id===product.category));
    assert.match(product.id,/^[a-z0-9-]+$/);
    assert.ok(product.methods.length>0);
  }
});
