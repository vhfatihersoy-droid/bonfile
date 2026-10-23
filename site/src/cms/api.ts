import { documentSchema, type CatalogDocument } from './model';
export type CmsClient = typeof cmsClient;
export const cmsClient = Object.freeze({kind:'sites'});
export interface Draft {document:CatalogDocument;revision:number;updated_at:string;}
export async function request<T>(path:string,init:RequestInit={}):Promise<T>{
 const response=await fetch(`/api/${path}`,{...init,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(30000)});
 const data=await response.json();if(!response.ok)throw new Error((data as {error?:string}).error||'SERVICE_UNAVAILABLE');return data as T;
}
const mutation=(value:unknown):RequestInit=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
export async function loadDraft(_client:CmsClient):Promise<Draft>{const data=await request<Draft>('draft');return {...data,document:documentSchema.parse(data.document)};}
export async function saveDraft(_client:CmsClient,document:CatalogDocument,revision:number):Promise<Draft>{return request('draft',mutation({document:documentSchema.parse(document),revision}));}
export async function publishDraft(_client:CmsClient,revision:number):Promise<number>{return (await request<{revision:number}>('publish',mutation({revision}))).revision;}
export async function restoreRevision(_client:CmsClient,id:number,revision:number):Promise<Draft>{return request('restore',mutation({id,revision}));}
export const getHistory=()=>request<{history:{id:number;published_at:string;source_revision:number}[];liveRevision:number}>('history');
export const listMedia=()=>request<{name:string}[]>('library');
export const deleteMedia=(key:string)=>request('library',{...mutation({key}),method:'DELETE'});
export function errorMessage(error:unknown) {
  const message=error && typeof error==='object' && 'message' in error ? String(error.message) : '';
  if(message.includes('REVISION_CONFLICT')) return 'İçerik başka bir oturumda değişmiş. Değişikliklerinizi JSON olarak indirin, ardından sunucudaki taslağı yeniden yükleyin.';
  if(message.includes('FORBIDDEN')||message.includes('row-level')||message.includes('JWT')||message.includes('permission')) return 'Oturumunuz veya yönetici yetkiniz doğrulanamadı. Yeniden giriş yapın.';
  if(message.includes('INVALID_MEDIA')) return 'Seçilen görsel artık kütüphanede yok. Yeniden bir görsel seçin.';
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

export async function uploadImage(_client:CmsClient,file:File,_userId:string):Promise<string>{
 const blob=await prepareImage(file);return (await request<{image:string}>('library',{method:'POST',headers:{'Content-Type':'image/webp'},body:blob})).image;
}
