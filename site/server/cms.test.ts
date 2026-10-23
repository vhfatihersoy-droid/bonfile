import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {handleCms,type Identity,type CmsEnv} from './cms';
import {initialDocument} from '../src/cms/model';
const origin='https://catalog.example';
const owner={userId:'site-scoped-owner',email:'owner@example.com'};
function fixture(){
 const sql=new DatabaseSync(':memory:');for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')))sql.exec(readFileSync(`drizzle/${name}`,'utf8'));
 class Statement{
  values:any[]=[];constructor(public query:string){}bind(...values:any[]){this.values=values;return this;}
  async first(){return sql.prepare(this.query).get(...this.values)||null;}
  async all(){const results=sql.prepare(this.query).all(...this.values);return {results,success:true};}
  async run(){const result=sql.prepare(this.query).run(...this.values);return {results:[],success:true,meta:{changes:Number(result.changes)}};}
 }
 const objects=new Map<string,Uint8Array>();
 const env={ADMIN_BOOTSTRAP_EMAIL:owner.email,DB:{prepare:(q:string)=>new Statement(q),batch:async(statements:Statement[])=>{sql.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.all());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}},BUCKET:{put:async(key:string,data:Uint8Array)=>objects.set(key,data),get:async(key:string)=>objects.has(key)?{body:objects.get(key)}:null,delete:async(key:string)=>{objects.delete(key);}}} as unknown as CmsEnv;
 async function call(path:string,method='GET',data?:unknown,user:Identity=owner,headers:Record<string,string>={}){
  const response=await handleCms(new Request(`${origin}/api/${path}`,{method,headers:{...(method!=='GET'?{origin,'content-type':'application/json'}:{}),...headers},body:data===undefined?undefined:JSON.stringify(data)}),env,user);
  return {status:response.status,data:await response.json() as any};
 }
 return {sql,env,call,objects};
}
test('anonymous and other accounts cannot read drafts, write, upload or bootstrap; identity binds once',async()=>{
 const {call}=fixture();
 for(const user of [null,{userId:'other',email:'other@example.com'}]){
  for(const [path,method] of [['draft','GET'],['draft','POST'],['publish','POST'],['restore','POST'],['library','GET'],['library','POST'],['library','DELETE'],['history','GET']])assert.ok([401,403].includes((await call(path,method,undefined,user)).status));
  assert.equal((await call('session','POST',undefined,user)).data.admin, user?false:undefined);
 }
 assert.equal((await call('session','POST')).data.admin,true);
 assert.equal((await call('session','GET',undefined,{...owner,email:'changed@example.com'})).data.admin,true);
 assert.equal((await call('session','POST',undefined,{userId:'impostor',email:owner.email})).data.admin,false);
});
test('mutation origin check blocks missing, foreign and cross-site requests',async()=>{
 const {call}=fixture();
 assert.equal((await call('session','POST',undefined,owner,{origin:''})).status,403);
 assert.equal((await call('session','POST',undefined,owner,{origin:'https://evil.example'})).status,403);
 assert.equal((await call('session','POST',undefined,owner,{'sec-fetch-site':'cross-site'})).status,403);
});
test('draft save does not publish; publish filters hidden products and restore retains history',async()=>{
 const {call}=fixture();await call('session','POST');const initial=await call('catalog','GET',undefined,null);assert.equal(initial.data.products.length,13);
 const draft=(await call('draft')).data;const doc=structuredClone(draft.document);doc.home.heroTitle='Yeni başlık';doc.products[0].published=false;
 assert.equal((await call('draft','POST',{document:doc,revision:1})).data.revision,2);
 assert.equal((await call('catalog','GET',undefined,null)).data.home.heroTitle,initial.data.home.heroTitle);
 assert.equal((await call('publish','POST',{revision:1})).status,409);
 assert.equal((await call('publish','POST',{revision:2})).status,200);
 const live=(await call('catalog','GET',undefined,null)).data;assert.equal(live.home.heroTitle,'Yeni başlık');assert.equal(live.products.length,12);assert.ok(!live.home.featuredIds.includes(doc.products[0].id));
 await call('publish','POST',{revision:2});assert.equal((await call('history')).data.history.length,2);
 doc.home.heroTitle='İkinci başlık';await call('draft','POST',{document:doc,revision:2});await call('publish','POST',{revision:3});
 const history=(await call('history')).data.history;assert.equal(history.length,3);
 const restored=await call('restore','POST',{id:history[1].id,revision:3});assert.equal(restored.data.revision,4);assert.equal(restored.data.document.home.heroTitle,'Yeni başlık');assert.equal((await call('catalog','GET',undefined,null)).data.home.heroTitle,'İkinci başlık');
});
test('stale writers, invalid documents and unknown images fail without changing data',async()=>{
 const {call}=fixture();await call('session','POST');await call('draft');const doc=structuredClone(initialDocument);
 assert.equal((await call('draft','POST',{document:{...doc,evil:true},revision:1})).status,400);
 doc.home.heroImage='media:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb.webp';
 assert.equal((await call('draft','POST',{document:doc,revision:1})).data.error,'INVALID_MEDIA');
 doc.home.heroImage='steak';await call('draft','POST',{document:doc,revision:1});assert.equal((await call('draft','POST',{document:doc,revision:1})).status,409);assert.equal((await call('draft')).data.revision,2);
});
test('uploads enforce bytes and MIME; referenced media and history assets cannot be deleted',async()=>{
 const {call,env,objects,sql}=fixture();await call('session','POST');await call('draft');
 const upload=(data:Uint8Array,type='image/webp')=>handleCms(new Request(`${origin}/api/library`,{method:'POST',headers:{origin,'content-type':type},body:data.slice().buffer}),env,owner);
 assert.equal((await upload(new TextEncoder().encode('<svg></svg>'),'image/svg+xml')).status,415);assert.equal((await upload(new Uint8Array(25))).status,400);assert.equal((await upload(new Uint8Array(5*1024*1024+1))).status,413);
 const webp=new Uint8Array(32);webp.set(new TextEncoder().encode('RIFF'),0);webp.set(new TextEncoder().encode('WEBPVP8 '),8);
 const response=await upload(webp);assert.equal(response.status,201);const {image}=await response.json() as {image:string};const key=image.slice(6);assert.ok(objects.has(key));
 const doc=structuredClone(initialDocument);doc.home.heroImage=image;assert.equal((await call('draft','POST',{document:doc,revision:1})).status,200);
 assert.equal((await call('library','DELETE',{key})).status,409);await call('publish','POST',{revision:2});
 doc.home.heroImage='steak';await call('draft','POST',{document:doc,revision:2});await call('publish','POST',{revision:3});assert.equal((await call('library','DELETE',{key})).status,409);
 const unused=await upload(webp);const unusedKey=((await unused.json() as any).image as string).slice(6);assert.equal((await call('library','DELETE',{key:unusedKey})).status,200);assert.ok(!objects.has(unusedKey));
 const tombstone='cccccccc-cccc-cccc-cccc-cccccccccccc/dddddddd-dddd-dddd-dddd-dddddddddddd.webp';sql.prepare('INSERT INTO cms_media VALUES (?,?,?,?,?)').run(tombstone,'deleting','image/webp','now',owner.userId);doc.home.heroImage=`media:${tombstone}`;assert.equal((await call('draft','POST',{document:doc,revision:3})).data.error,'INVALID_MEDIA');
});
