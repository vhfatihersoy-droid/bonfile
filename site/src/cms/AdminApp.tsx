'use client';
import {useEffect,useState} from 'react';
import {LockKeyhole,ArrowLeft} from 'lucide-react';
import {OzlemceLogo} from '../components/OzlemceLogo';
import {cmsClient,request} from './api';
import {Editor} from './Editor';
import './admin.css';
type Session={user:{id:string;email:string}|null;admin:boolean};
export default function AdminApp({onDirtyChange}:{onDirtyChange?:(dirty:boolean)=>void}){
 const [session,setSession]=useState<Session|null>(null);const [error,setError]=useState(false);
 useEffect(()=>{let active=true;(async()=>{try{let data=await request<Session>('session');if(data.user&&!data.admin)data=await request<Session>('session',{method:'POST'});if(active)setSession(data);}catch{if(active)setError(true);}})();return()=>{active=false;};},[]);
 if(session?.user&&session.admin)return <Editor client={cmsClient} userId={session.user.id} email={session.user.email} onDirtyChange={onDirtyChange}/>;
 return <main className="cms cms-auth"><section className="cms-auth-card"><OzlemceLogo size="lg"/><div className="cms-auth-icon"><LockKeyhole size={24}/></div><span className="cms-kicker">ÖZLEMCE İÇERİK STÜDYOSU</span><h1>{error?'Bağlantı kurulamadı':!session?'Giriş kontrol ediliyor…':session.user?'Bu hesabın yönetim yetkisi yok.':'İçerikleriniz, tek bir yerde.'}</h1><p>{error?'Lütfen bağlantınızı kontrol edip yeniden deneyin.':!session?'Lütfen bekleyin.':session.user?`${session.user.email} ile giriş yapıldı. Yönetici olarak yetkilendirilmiş ChatGPT hesabınıza geçin.`:'Ürünleri, görselleri ve ana sayfayı yönetmek için yetkili ChatGPT hesabınızla giriş yapın.'}</p>{error?<button className="primary" onClick={()=>window.location.reload()}>Yeniden dene</button>:session?.user?<a className="cms-login-button" href="/signout-with-chatgpt?return_to=%2F%23%2Fyonetim" target="_top">Çıkış yap ve hesap değiştir</a>:session&&<a className="cms-login-button" href="/signin-with-chatgpt?return_to=%2F%23%2Fyonetim" target="_top">ChatGPT ile güvenli giriş</a>}<a className="cms-back" href="#/ana-sayfa"><ArrowLeft size={16}/> Siteye dön</a></section></main>;
}
