import { documentSchema, initialDocument, publicDocument, type CatalogDocument } from '../src/cms/model';
export type Identity = {userId:string; email:string} | null;
export type CmsEnv = {DB?:D1Database; BUCKET?:R2Bucket; ADMIN_BOOTSTRAP_EMAIL?:string};
class ApiError extends Error {constructor(public status:number, message:string){super(message);}}
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const conflict=()=>new ApiError(409,'REVISION_CONFLICT');
const mediaKey=/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/;
const date=()=>new Date().toISOString();
async function initialize(db:D1Database) {
  const doc=JSON.stringify(initialDocument);
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO cms_state (id,document,revision,updated_at,live_document,live_revision) VALUES (?,?,?,?,?,?)').bind('main',doc,1,date(),doc,1),
    db.prepare('INSERT OR IGNORE INTO cms_publications (document,source_revision,published_at,actor) VALUES (?,?,?,?)').bind(doc,1,date(),'initial-catalog'),
  ]);
}
async function administrator(db:D1Database,user:Identity) {
  if(!user) throw new ApiError(401,'FORBIDDEN');
  const row=await db.prepare('SELECT user_id FROM cms_admins WHERE id=? AND user_id=?').bind('main',user.userId).first();
  if(!row) throw new ApiError(403,'FORBIDDEN');
  return user;
}
function sameOrigin(request:Request){
  if(request.headers.get('origin')!==new URL(request.url).origin || request.headers.get('sec-fetch-site')==='cross-site') throw new ApiError(403,'FORBIDDEN_ORIGIN');
}
async function bytes(request:Request,max:number) {
  if(Number(request.headers.get('content-length')||0)>max) throw new ApiError(413,'BODY_TOO_LARGE');
  const reader=request.body?.getReader(); if(!reader)throw new ApiError(400,'INVALID_BODY');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new ApiError(413,'BODY_TOO_LARGE');}chunks.push(value);}
  const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;
}
async function body(request:Request):Promise<Record<string,unknown>> {
  if(request.headers.get('content-type')?.split(';')[0]!=='application/json')throw new ApiError(415,'INVALID_BODY');
  try {const data=JSON.parse(new TextDecoder().decode(await bytes(request,2_000_000)));if(!data||typeof data!=='object'||Array.isArray(data))throw 0;return data;}catch(e){if(e instanceof ApiError)throw e;throw new ApiError(400,'INVALID_BODY');}
}
function revision(value:unknown){if(!Number.isSafeInteger(value)||Number(value)<1)throw new ApiError(400,'INVALID_REVISION');return Number(value);}
function document(value:unknown){const result=documentSchema.safeParse(value);if(!result.success)throw new ApiError(400,'INVALID_DOCUMENT');return result.data;}
// A single conditional statement prevents deleted/unknown images from entering a draft.
const availableImages=`NOT EXISTS (SELECT 1 FROM json_tree(?) j WHERE j.type='text' AND j.value LIKE 'media:%' AND NOT EXISTS (SELECT 1 FROM cms_media m WHERE 'media:' || m.key=j.value AND m.status='ready'))`;
async function save(db:D1Database,doc:CatalogDocument,expected:number){
  const encoded=JSON.stringify(doc);
  const row=await db.prepare(`UPDATE cms_state SET document=?,revision=revision+1,updated_at=? WHERE id='main' AND revision=? AND ${availableImages} RETURNING document,revision,updated_at`).bind(encoded,date(),expected,encoded).first<{document:string;revision:number;updated_at:string}>();
  if(!row){const current=await db.prepare("SELECT revision FROM cms_state WHERE id='main'").first<{revision:number}>();if(current?.revision===expected)throw new ApiError(400,'INVALID_MEDIA');throw conflict();}
  return {...row,document:JSON.parse(row.document)};
}
export async function handleCms(request:Request,env:CmsEnv,user:Identity):Promise<Response> {
 try {
  const url=new URL(request.url);const path=url.pathname.replace(/\/$/,'');const method=request.method;
  const db=env.DB;if(!db)throw new ApiError(503,'SERVICE_UNAVAILABLE');
  if(path==='/api/catalog' && method==='GET'){
    await initialize(db);const state=await db.prepare("SELECT live_document FROM cms_state WHERE id='main'").first<{live_document:string}>();
    const response=json(publicDocument(document(JSON.parse(state!.live_document))));
    response.headers.set('Vary','Origin');
    // Cross-origin access is limited to the already-public catalog, without credentials.
    if(request.headers.get('origin')==='https://vhfatihersoy-droid.github.io')response.headers.set('Access-Control-Allow-Origin','https://vhfatihersoy-droid.github.io');
    return response;
  }
  if(path.startsWith('/api/media/')&&method==='GET'){
    const key=path.slice('/api/media/'.length);if(!mediaKey.test(key)||!env.BUCKET)throw new ApiError(404,'NOT_FOUND');
    const record=await db.prepare("SELECT content_type FROM cms_media WHERE key=? AND status='ready'").bind(key).first<{content_type:string}>();
    if(!record)throw new ApiError(404,'NOT_FOUND');const file=await env.BUCKET.get(key);if(!file)throw new ApiError(404,'NOT_FOUND');
    return new Response(file.body,{headers:{'Content-Type':record.content_type,'Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Content-Disposition':'inline'}});
  }
  if(!['GET','POST','DELETE'].includes(method))throw new ApiError(405,'METHOD_NOT_ALLOWED');
  if(method!=='GET')sameOrigin(request);
  if(path==='/api/session'&&(method==='GET'||method==='POST')){
    if(method==='POST'){
      if(!user)throw new ApiError(401,'FORBIDDEN');
      // The platform supplies verified identity. Bootstrap only the explicitly selected email,
      // then authorize the immutable Site-scoped user ID, including after email changes.
      if(env.ADMIN_BOOTSTRAP_EMAIL && user.email.toLowerCase()===env.ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase()){
        await db.prepare('INSERT OR IGNORE INTO cms_admins (id,user_id,email,created_at) VALUES (?,?,?,?)').bind('main',user.userId,user.email,date()).run();
      }
    }
    let allowed=false;if(user)allowed=!!await db.prepare("SELECT id FROM cms_admins WHERE id='main' AND user_id=?").bind(user.userId).first();
    return json({user:user?{id:user.userId,email:user.email}:null,admin:allowed});
  }
  const admin=await administrator(db,user);await initialize(db);
  if(path==='/api/draft'&&method==='GET'){
    const row=await db.prepare("SELECT document,revision,updated_at FROM cms_state WHERE id='main'").first<{document:string;revision:number;updated_at:string}>();return json({...row,document:JSON.parse(row!.document)});
  }
  if(path==='/api/draft'&&method==='POST'){
    const data=await body(request);return json(await save(db,document(data.document),revision(data.revision)));
  }
  if(path==='/api/history'&&method==='GET'){
    const history=await db.prepare('SELECT id,published_at,source_revision FROM cms_publications ORDER BY id DESC LIMIT 30').all();
    const state=await db.prepare("SELECT live_revision FROM cms_state WHERE id='main'").first<{live_revision:number}>();return json({history:history.results,liveRevision:state!.live_revision});
  }
  if(path==='/api/publish'&&method==='POST'){
    const data=await body(request);const expected=revision(data.revision);
    // D1 batch is one transaction. Both statements read the same saved draft;
    // source_revision is unique, making repeated publication idempotent.
    const results=await db.batch([
      db.prepare("INSERT OR IGNORE INTO cms_publications (document,source_revision,published_at,actor) SELECT document,revision,?,? FROM cms_state WHERE id='main' AND revision=?").bind(date(),admin.userId,expected),
      db.prepare("UPDATE cms_state SET live_document=document,live_revision=revision WHERE id='main' AND revision=? RETURNING revision").bind(expected),
    ]);
    if(!results[1].results.length)throw conflict();return json({revision:expected});
  }
  if(path==='/api/restore'&&method==='POST'){
    const data=await body(request);const expected=revision(data.revision);const id=revision(data.id);
    const record=await db.prepare('SELECT document FROM cms_publications WHERE id=?').bind(id).first<{document:string}>();if(!record)throw new ApiError(404,'NOT_FOUND');return json(await save(db,document(JSON.parse(record.document)),expected));
  }
  if(path==='/api/library'&&method==='GET'){
    const rows=await db.prepare("SELECT key AS name FROM cms_media WHERE status='ready' ORDER BY created_at DESC LIMIT 1000").all();return json(rows.results);
  }
  if(path==='/api/library'&&method==='POST'){
    if(!env.BUCKET)throw new ApiError(503,'SERVICE_UNAVAILABLE');
    // The browser re-encodes images as WebP. Validate the container again on the server.
    if(request.headers.get('content-type')!=='image/webp')throw new ApiError(415,'INVALID_IMAGE');
    const data=await bytes(request,5*1024*1024);const decoder=new TextDecoder();
    if(data.length<20||decoder.decode(data.slice(0,4))!=='RIFF'||decoder.decode(data.slice(8,12))!=='WEBP'||!['VP8 ','VP8L','VP8X'].includes(decoder.decode(data.slice(12,16))))throw new ApiError(400,'INVALID_IMAGE');
    const key=`${crypto.randomUUID()}/${crypto.randomUUID()}.webp`;
    await env.BUCKET.put(key,data,{httpMetadata:{contentType:'image/webp'}});
    try {await db.prepare('INSERT INTO cms_media (key,status,content_type,created_at,owner) VALUES (?,?,?,?,?)').bind(key,'ready','image/webp',date(),admin.userId).run();}
    catch(e){await env.BUCKET.delete(key);throw e;}
    return json({image:`media:${key}`},201);
  }
  if(path==='/api/library'&&method==='DELETE'){
    if(!env.BUCKET)throw new ApiError(503,'SERVICE_UNAVAILABLE');const data=await body(request);const key=String(data.key||'');if(!mediaKey.test(key))throw new ApiError(400,'INVALID_MEDIA');
    // Tombstone atomically before R2 deletion: concurrent saves cannot reference this object.
    const row=await db.prepare(`UPDATE cms_media SET status='deleting' WHERE key=? AND NOT EXISTS (SELECT 1 FROM cms_state s,json_tree(s.document) j WHERE j.value=?) AND NOT EXISTS (SELECT 1 FROM cms_state s,json_tree(s.live_document) j WHERE j.value=?) AND NOT EXISTS (SELECT 1 FROM cms_publications p,json_tree(p.document) j WHERE j.value=?) RETURNING key`).bind(key,`media:${key}`,`media:${key}`,`media:${key}`).first();
    if(!row)throw new ApiError(409,'MEDIA_IN_USE');await env.BUCKET.delete(key);await db.prepare("DELETE FROM cms_media WHERE key=? AND status='deleting'").bind(key).run();return json({deleted:true});
  }
  throw new ApiError(404,'NOT_FOUND');
 }catch(error){if(error instanceof ApiError)return json({error:error.message},error.status);console.error('CMS operation failed',error instanceof Error?error.name:'UnknownError');return json({error:'SERVICE_UNAVAILABLE'},503);}
}
