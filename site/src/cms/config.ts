// Only the public catalog origin is embedded in the GitHub Pages build.
// The Sites build keeps same-origin API calls and its existing login flow.
const environment=import.meta.env;
export const publicApiOrigin=(environment?.VITE_PUBLIC_API_ORIGIN||'').replace(/\/$/,'');
export const publicApiUrl=(path:string)=>`${publicApiOrigin}/api/${path}`;
export const mediaUrl=(path:string)=>publicApiUrl(`media/${path}`);
export const assetUrl=(path:string)=>`${environment?.BASE_URL||'/'}${path.replace(/^\/+/, '')}`;
export const adminHref=publicApiOrigin?`${publicApiOrigin}/#/yonetim`:'#/yonetim';
