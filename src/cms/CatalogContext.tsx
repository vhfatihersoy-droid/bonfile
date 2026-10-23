import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { documentSchema, initialDocument, publicDocument, type CatalogDocument } from './model';
import { getConfig } from './config';
export const CatalogContext = createContext<CatalogDocument>(initialDocument);
export const useCatalog = () => useContext(CatalogContext);
export function CatalogProvider({children}: {children:ReactNode}) {
  const [document,setDocument]=useState<CatalogDocument | null>(null);
  const [error,setError]=useState(false);
  useEffect(()=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    let active=true;
    async function load() {
      try {
        const config=await getConfig();
        if(!config) {if(active) setDocument(initialDocument);return;}
        const response=await fetch(`${config.url}/rest/v1/catalog_live?id=eq.main&select=document`,{headers:{apikey:config.publishableKey},signal:controller.signal,cache:'no-store'});
        if(!response.ok) throw new Error('Katalog alınamadı.');
        const rows=await response.json();
        const result=documentSchema.parse(rows[0]?.document);
        if(active) setDocument(publicDocument(result));
      } catch {if(active) setError(true);}
    }
    void load();
    return ()=>{active=false;clearTimeout(timeout);controller.abort();};
  },[]);
  if(error) return <div className="catalog-connection" role="alert"><h1>Kataloğa şu anda ulaşılamıyor.</h1><p>Lütfen bağlantınızı kontrol edip yeniden deneyin.</p><button className="button" onClick={()=>window.location.reload()}>Yeniden dene</button></div>;
  if(!document) return <div className="catalog-connection" role="status">Özlemce kataloğu hazırlanıyor…</div>;
  return <CatalogContext.Provider value={document}>{children}</CatalogContext.Provider>;
}
