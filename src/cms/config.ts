export interface CmsConfig { url: string; publishableKey: string; bucket: 'catalog-media' }
let configPromise: Promise<CmsConfig | null> | undefined;
let activeConfig: CmsConfig | null = null;
export function validateConfig(value: unknown): CmsConfig | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Yönetim bağlantısı geçersiz.');
  if ('enabled' in value && value.enabled === false && Object.keys(value).length === 1) return null;
  if (Object.keys(value).some(key => !['url','publishableKey','bucket'].includes(key))) throw new Error('Yönetim bağlantısında izin verilmeyen alan var.');
  const config = value as Partial<CmsConfig>;
  if (!config || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url || '') || config.bucket !== 'catalog-media' || !config.publishableKey?.startsWith('sb_publishable_')) throw new Error('Yönetim bağlantısı geçersiz.');
  return config as CmsConfig;
}
export function getConfig() {
  return configPromise ??= fetch(`${import.meta.env.BASE_URL}cms-config.json`, {cache:'no-store',signal:AbortSignal.timeout(10000)}).then(async response=>{
    if(!response.ok) throw new Error('Yönetim bağlantısı okunamadı.');
    activeConfig=validateConfig(await response.json());
    return activeConfig;
  }).catch(error=>{configPromise=undefined;throw error;});
}
export function mediaUrl(path: string): string {
  return activeConfig ? `${activeConfig.url}/storage/v1/object/public/${activeConfig.bucket}/${path}` : '';
}
