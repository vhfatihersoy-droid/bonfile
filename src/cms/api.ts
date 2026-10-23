import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from './config';
import { documentSchema, type CatalogDocument } from './model';
let client: SupabaseClient | null = null;
export async function getClient(): Promise<SupabaseClient | null> {
  const config=await getConfig();
  if(!config) return null;
  return client ??= createClient(config.url, config.publishableKey, {auth:{storage:window.sessionStorage,storageKey:'ozlemce-cms-session',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
}
export interface Draft { document:CatalogDocument; revision:number; updated_at:string; }
export async function loadDraft(client:SupabaseClient):Promise<Draft> {
  const {data,error}=await client.from('cms_drafts').select('document,revision,updated_at').eq('id','main').single();
  if(error) throw error;
  return {...data,document:documentSchema.parse(data.document)};
}
export async function saveDraft(client:SupabaseClient,document:CatalogDocument,revision:number):Promise<Draft> {
  const validated=documentSchema.parse(document);
  const {data,error}=await client.rpc('save_catalog_draft',{expected_revision:revision,new_document:validated});
  if(error) throw error;
  return {...data,document:documentSchema.parse(data.document)};
}
export async function publishDraft(client:SupabaseClient,revision:number):Promise<number> {
  const {data,error}=await client.rpc('publish_catalog',{expected_revision:revision});
  if(error) throw error;
  return data;
}
export async function restoreRevision(client:SupabaseClient,id:number,revision:number):Promise<Draft> {
  const {data,error}=await client.rpc('restore_catalog_revision',{publication_id:id,expected_revision:revision});
  if(error) throw error;
  return {...data,document:documentSchema.parse(data.document)};
}
export function errorMessage(error:unknown) {
  const message=error && typeof error==='object' && 'message' in error ? String(error.message) : '';
  if(message.includes('REVISION_CONFLICT')) return 'İçerik başka bir oturumda değişmiş. Değişikliklerinizi JSON olarak indirin, ardından sunucudaki taslağı yeniden yükleyin.';
  if(message.includes('FORBIDDEN')||message.includes('row-level')||message.includes('JWT')||message.includes('permission')) return 'Oturumunuz veya yönetici yetkiniz doğrulanamadı. Yeniden giriş yapın.';
  if(message.includes('INVALID_DOCUMENT')) return 'İçerik doğrulanamadı. Alanları ve ürün bağlantı adlarını kontrol edin.';
  return 'İşlem tamamlanamadı. Bağlantınızı kontrol edip yeniden deneyin. Değişiklikleriniz bu ekranda korunuyor.';
}
export async function prepareImage(file:File):Promise<Blob> {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024) throw new Error('JPG, PNG veya WebP biçiminde, en fazla 5 MB bir görsel seçin.');
  let bitmap:ImageBitmap;
  try {bitmap=await createImageBitmap(file);} catch {throw new Error('Görsel okunamadı. Geçerli bir resim dosyası seçin.');}
  if(bitmap.width<100||bitmap.height<100||bitmap.width*bitmap.height>40_000_000) {bitmap.close();throw new Error('Görsel en az 100 × 100 piksel, en fazla 40 megapiksel olmalı.');}
  const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  const context=canvas.getContext('2d');if(!context) {bitmap.close();throw new Error('Tarayıcı görsel hazırlamayı desteklemiyor.');}
  context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  // Re-encoding drops metadata and prevents active content from being uploaded.
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Görsel hazırlanamadı.')),'image/webp',0.88));
}
export async function uploadImage(client:SupabaseClient,file:File,userId:string):Promise<string> {
  const blob=await prepareImage(file);
  const path=`${userId}/${crypto.randomUUID()}.webp`;
  const {error}=await client.storage.from('catalog-media').upload(path,blob,{contentType:'image/webp',upsert:false,cacheControl:'31536000'});
  if(error) throw error;
  return `media:${path}`;
}
