import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { OzlemceLogo } from '../components/OzlemceLogo';
import { getClient } from './api';
import { Editor } from './Editor';
import './admin.css';

type Access = {kind:'loading'} | {kind:'login'} | {kind:'disabled'} | {kind:'error'} | {kind:'denied'} | {kind:'framed'} | {kind:'mfa';factorId?:string} | {kind:'ready';userId:string;email:string};
export default function AdminApp({onDirtyChange}:{onDirtyChange?:(dirty:boolean)=>void}) {
  const [client,setClient]=useState<SupabaseClient|null>(null);
  const [access,setAccess]=useState<Access>({kind:'loading'});
  const generation=useRef(0);
  const check=useCallback(async (connection:SupabaseClient)=>{
    const current=++generation.current;
    const {data:{user},error}=await connection.auth.getUser();
    if(current!==generation.current)return;
    if(error||!user){setAccess({kind:'login'});return;}
    const {data:member,error:memberError}=await connection.rpc('is_catalog_member');
    if(current!==generation.current)return;
    if(memberError){setAccess({kind:'error'});return;}
    if(!member){setAccess({kind:'denied'});return;}
    const {data:assurance,error:assuranceError}=await connection.auth.mfa.getAuthenticatorAssuranceLevel();
    if(current!==generation.current)return;
    if(assuranceError){setAccess({kind:'error'});return;}
    if(assurance?.currentLevel==='aal2'){setAccess({kind:'ready',userId:user.id,email:user.email||''});return;}
    const {data:factors,error:factorError}=await connection.auth.mfa.listFactors();
    if(current!==generation.current)return;
    if(factorError){setAccess({kind:'error'});return;}
    setAccess({kind:'mfa',factorId:factors?.totp.find(f=>f.status==='verified')?.id});
  },[]);
  useEffect(()=>{
    if(window.self!==window.top){setAccess({kind:'framed'});return;}
    document.title='Güvenli yönetim | Özlemce';
    let stopped=false;let unsubscribe:(()=>void)|undefined;let pending:ReturnType<typeof setTimeout>|undefined;
    getClient().then(connection=>{
      if(stopped)return;
      if(!connection){setAccess({kind:'disabled'});return;}
      setClient(connection);void check(connection);
      const {data}=connection.auth.onAuthStateChange(event=>{
        if(event==='INITIAL_SESSION')return;
        clearTimeout(pending);
        if(event==='SIGNED_OUT'){generation.current++;setAccess({kind:'login'});}
        else pending=setTimeout(()=>{if(!stopped)void check(connection);},0);
      });unsubscribe=()=>data.subscription.unsubscribe();
    }).catch(()=>{if(!stopped)setAccess({kind:'error'});});
    return ()=>{stopped=true;generation.current++;clearTimeout(pending);unsubscribe?.();};
  },[check]);
  useEffect(()=>{
    if(!client||!['mfa','ready','denied'].includes(access.kind))return;
    let lastActivity=Date.now();const activity=()=>{lastActivity=Date.now();};
    const events=['pointerdown','keydown'] as const;events.forEach(e=>window.addEventListener(e,activity));
    const timer=setInterval(()=>{if(Date.now()-lastActivity>30*60*1000)void client.auth.signOut({scope:'local'});},30000);
    return ()=>{clearInterval(timer);events.forEach(e=>window.removeEventListener(e,activity));};
  },[client,access.kind]);
  if(access.kind==='ready'&&client) return <Editor client={client} userId={access.userId} email={access.email} onDirtyChange={onDirtyChange}/>;
  return <div className="cms cms-auth"><a className="cms-back" href="#/ana-sayfa"><ArrowLeft size={17}/> Siteye dön</a><main className="cms-auth-card"><OzlemceLogo size="lg"/><div className="cms-auth-icon"><LockKeyhole size={25}/></div><span className="cms-kicker">ÖZLEMCE YÖNETİM</span><h1>İçeriğinize<br/>güvenle yön verin.</h1>
    {access.kind==='framed'&&<p>Yönetim panelini doğrudan kendi sekmesinde açın.</p>}
    {access.kind==='loading'&&<p role="status">Güvenli bağlantı kontrol ediliyor…</p>}
    {access.kind==='disabled'&&<div role="status"><p>Yönetim altyapısının bağlantısı henüz tamamlanmadı.</p><p>Ürün kataloğu yayında. Panel, güvenli bağlantı etkinleştirildiğinde kullanıma açılacak.</p></div>}
    {access.kind==='error'&&<div role="alert"><p>Güvenli bağlantı doğrulanamadı.</p><button onClick={()=>window.location.reload()}>Yeniden dene</button></div>}
    {access.kind==='denied'&&<div role="alert"><p>Bu hesap için yönetici yetkisi bulunmuyor.</p><button onClick={()=>void client?.auth.signOut({scope:'local'})}>Farklı hesapla giriş yap</button></div>}
    {access.kind==='login'&&client&&<EmailLogin client={client} onComplete={()=>void check(client)}/>}
    {access.kind==='mfa'&&client&&<SecondFactor key={access.factorId||'enroll'} client={client} factorId={access.factorId} onComplete={()=>void check(client)}/>}
    <p className="cms-auth-note"><ShieldCheck size={16}/> Yalnızca yetkili hesaplar · İki adımlı doğrulama</p></main></div>;
}
function EmailLogin({client,onComplete}:{client:SupabaseClient;onComplete:()=>void}) {
  const [email,setEmail]=useState('');const [code,setCode]=useState('');const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [resendAt,setResendAt]=useState(0);
  async function send(event:FormEvent){event.preventDefault();if(busy)return;setBusy(true);setMessage('');
    const {error}=await client.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:false}});
    setBusy(false);if(error){setMessage('Kod gönderilemedi. E-posta adresinizi kontrol edin; biraz sonra yeniden deneyin.');return;}setSent(true);setResendAt(Date.now()+60000);setMessage('Hesabınız yetkiliyse giriş kodu e-posta adresinize gönderildi.');
  }
  async function verify(event:FormEvent){event.preventDefault();if(busy)return;setBusy(true);setMessage('');const {error}=await client.auth.verifyOtp({email:email.trim(),token:code.trim(),type:'email'});setBusy(false);if(error){setMessage('Kod geçersiz veya süresi dolmuş. Yeni bir kod isteyebilirsiniz.');return;}onComplete();}
  return <form onSubmit={sent?verify:send}><p>Yetkili e-posta adresinize gelen tek kullanımlık kodla başlayın.</p><label>E-posta adresi<input type="email" autoComplete="email" required maxLength={254} value={email} readOnly={sent} onChange={e=>setEmail(e.target.value)}/></label>{sent&&<label>E-posta doğrulama kodu<input autoFocus inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} minLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))}/></label>}<button className="primary" disabled={busy}>{busy?'Kontrol ediliyor…':sent?'Kodu doğrula':'Giriş kodu gönder'}<ArrowRight size={18}/></button>{sent&&<button className="plain" type="button" disabled={busy} onClick={()=>{if(Date.now()<resendAt){setMessage('Yeni kod için bir dakika bekleyin.');return;}setSent(false);setCode('');setMessage('');}}>E-postayı değiştir / yeni kod iste</button>}{message&&<p role="status" className="cms-message">{message}</p>}</form>;
}
function SecondFactor({client,factorId,onComplete}:{client:SupabaseClient;factorId?:string;onComplete:()=>void}) {
  const [enrollment,setEnrollment]=useState<{id:string;qr:string}|null>(null);const [code,setCode]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  async function enroll(){setBusy(true);setMessage('');
    const {data:factors,error:listError}=await client.auth.mfa.listFactors();
    if(listError){setMessage('Doğrulama bilgileri alınamadı. Yeniden deneyin.');setBusy(false);return;}
    for(const factor of factors.all.filter(f=>f.factor_type==='totp'&&f.status==='unverified'&&f.friendly_name==='Özlemce Yönetim')) {const {error}=await client.auth.mfa.unenroll({factorId:factor.id});if(error){setMessage('Önceki kurulum temizlenemedi. Yeniden giriş yapın.');setBusy(false);return;}}
    const {data,error}=await client.auth.mfa.enroll({factorType:'totp',friendlyName:'Özlemce Yönetim',issuer:'Özlemce'});
    setBusy(false);if(error){setMessage('Doğrulayıcı kurulamadı. Yeniden deneyin.');return;}setEnrollment({id:data.id,qr:data.totp.qr_code});
  }
  async function verify(event:FormEvent){event.preventDefault();const id=factorId||enrollment?.id;if(!id||busy)return;setBusy(true);setMessage('');const {error}=await client.auth.mfa.challengeAndVerify({factorId:id,code});setBusy(false);if(error){setMessage('Kod doğrulanamadı. Doğrulayıcıdaki güncel altı haneli kodu deneyin.');return;}onComplete();}
  return <div>{!factorId&&!enrollment?<><p>Hesabınızı korumak için telefonunuzdaki doğrulayıcı uygulamasını bağlayın. İlk kurulumdan sonra her girişte uygulamadaki kod istenir.</p><button className="primary" disabled={busy} onClick={()=>void enroll()}>{busy?'Hazırlanıyor…':'Doğrulayıcıyı bağla'}</button></>:<form onSubmit={verify}>{enrollment&&<><img className="cms-qr" src={enrollment.qr} alt="Doğrulayıcı uygulamanızla tarayın"/><p>Google Authenticator, Microsoft Authenticator veya başka bir TOTP uygulamasıyla bu kodu tarayın. Uygulamanızda hesap yedeklemesini etkinleştirin.</p></>}<label>Doğrulayıcı uygulamasındaki kod<input autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))}/></label><button className="primary" disabled={busy}>{busy?'Doğrulanıyor…':'Güvenli giriş yap'}<ShieldCheck size={18}/></button></form>}{message&&<p role="alert" className="cms-message">{message}</p>}<button className="plain" onClick={()=>void client.auth.signOut({scope:'local'})}>Çıkış yap</button></div>;
}
