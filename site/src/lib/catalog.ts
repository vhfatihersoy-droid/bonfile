import type { CatalogProduct } from '../data/catalog';
export const normalizeSearch = (value: string) => value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g,'i').trim();
export function filterCatalog(products: CatalogProduct[], category: string, query: string) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return products.filter(product => (category === 'all' || product.category === category) && words.every(word => normalizeSearch(`${product.name} ${product.summary} ${product.cut} ${product.methods.join(' ')}`).includes(word)));
}
export function readRoute(hash: string) {
  const [path, search = ''] = hash.replace(/^#\/?/,'').split('?');
  return { path: path || 'ana-sayfa', params: new URLSearchParams(search) };
}
export function catalogHref(category='all', query='') {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('kategori', category);
  if (query.trim()) params.set('ara', query.trim());
  return `#/urunler${params.size ? `?${params}` : ''}`;
}
