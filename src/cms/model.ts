import { z } from 'zod';
import { catalogCategories, catalogProducts, featuredProductIds } from '../data/catalog';

export const bundledImages = ['steak','bonfile','izgara','kuzu','kofte','burger','sarkuteri','doner','kemikli','pastirma','sofra'] as const;
export const imageReference = z.string().refine(value => bundledImages.includes(value as typeof bundledImages[number]) || /^media:[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(value), 'Kütüphaneden bir görsel seçin.');
const text = (max: number) => z.string().trim().min(1, 'Bu alan gerekli.').max(max);
export const homeSchema = z.object({
  heroEyebrow: text(100), heroTitle: text(140), heroAccent: text(100), heroDescription: text(400), heroButton: text(80), heroImage: imageReference, heroImageAlt: text(200), heroCaption: text(120),
  categoriesTitle: text(140), featuredTitle: text(140), featuredDescription: text(300), featuredIds: z.array(z.string()).max(8),
  editorialEyebrow: text(100), editorialTitle: text(140), editorialAccent: text(100), editorialDescription: text(500), editorialButton: text(80), editorialImage: imageReference, editorialImageAlt: text(200),
  brandTitle: text(140), brandAccent: text(140),
}).strict();
export const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Bağlantı adı yalnızca küçük harf, rakam ve tire içerebilir.').max(100),
  name: text(120), category: z.enum(['steak','beef','lamb','meatball','charcuterie','doner','horeca']), image: imageReference,
  summary: text(240), description: text(3000), cut: text(120), methods: z.array(z.enum(['Tava','Izgara','Fırın','Tencere','Servis'])).min(1).max(5), weights: z.array(text(50)).max(20), published: z.boolean(),
}).strict();
export const documentSchema = z.object({ schemaVersion: z.literal(1), products: z.array(productSchema).max(300), home: homeSchema }).strict().superRefine((doc, ctx) => {
  const ids = doc.products.map(p => p.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({code:'custom',message:'Ürün bağlantı adları benzersiz olmalı.',path:['products']});
  if (new Set(doc.home.featuredIds).size !== doc.home.featuredIds.length || doc.home.featuredIds.some(id => !ids.includes(id))) ctx.addIssue({code:'custom',message:'Öne çıkan ürün seçimini kontrol edin.',path:['home','featuredIds']});
});
export type ManagedProduct = z.infer<typeof productSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type CatalogDocument = z.infer<typeof documentSchema>;
export const defaultHome: HomeContent = {
  heroEyebrow:'SOFRANIN BAŞLANGICI', heroTitle:'İyi bir sofra,\nözenli bir', heroAccent:'seçimle başlar.', heroDescription:'Gündelik lezzetlerden özel buluşmalara.\nSofranıza yakışan kesimi Özlemce ile keşfedin.', heroButton:'Ürünlerimizi keşfedin', heroImage:'steak', heroImageAlt:'Taze otlar ve baharatlarla hazırlanan et sunumu', heroCaption:'Lezzet, ayrıntıda saklı.',
  categoriesTitle:'Sofranıza göre seçin.', featuredTitle:'Bir sonraki sofranız için.', featuredDescription:'Sevilen kesimler, tanıdık lezzetler.\nMutfağınızın yeni fikri burada.', featuredIds:featuredProductIds,
  editorialEyebrow:'KESİMDEN SOFRAYA', editorialTitle:'Her kesimin\nkendine özgü', editorialAccent:'bir lezzeti var.', editorialDescription:'Izgaraya ne yakışır? Tencerede hangi kesim öne çıkar? Seçtiğiniz ürüne uygun hazırlama fikirlerini keşfedin.', editorialButton:'Mutfak rehberini inceleyin', editorialImage:'izgara', editorialImageAlt:'Izgarada hazırlanan et ve garnitür sunumu',
  brandTitle:'Sofralar değişir.', brandAccent:'Birlikte olmanın tadı kalır.',
};
export const initialDocument: CatalogDocument = documentSchema.parse({schemaVersion:1,products:catalogProducts.map(p=>({...p, published:true})),home:defaultHome});
export function publicDocument(document: CatalogDocument): CatalogDocument {
  const products = document.products.filter(p=>p.published);
  return {...document,products,home:{...document.home,featuredIds:document.home.featuredIds.filter(id=>products.some(p=>p.id===id))}};
}
export function validationMessage(document: unknown): string | null {
  const result = documentSchema.safeParse(document);
  return result.success ? null : result.error.issues.map(issue=>`${issue.path.join('.')}: ${issue.message}`).slice(0,5).join('\n');
}
export { catalogCategories };
