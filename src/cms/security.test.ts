import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { documentSchema, initialDocument, publicDocument } from './model';
import { validateConfig } from './config';

const db=new PGlite();
const admin='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const outsider='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const asset=`${admin}/cccccccc-cccc-4ccc-8ccc-cccccccccccc.webp`;
const unused=`${admin}/dddddddd-dddd-4ddd-8ddd-dddddddddddd.webp`;
async function identity(role:'anon'|'authenticated'|'postgres',id='',aal='aal1') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:id,aal})]);
  if(role!=='postgres')await db.exec(`set role ${role}`);
}
before(async()=>{
  await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb)$$;
    create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;
    grant usage on schema auth,storage,public to anon,authenticated;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text,created_at timestamptz default now());
    alter table storage.objects enable row level security;
    grant select,insert,update,delete on storage.objects to anon,authenticated;`);
  await db.exec(await readFile(new URL('../../supabase/migrations/202610230001_catalog_cms.sql',import.meta.url),'utf8'));
  await db.query('insert into auth.users values($1),($2)',[admin,outsider]);
  await db.query('insert into public.cms_admins(user_id) values($1)',[admin]);
  await db.query("insert into public.cms_drafts(id,document) values('main',$1::jsonb)",[JSON.stringify(initialDocument)]);
  await db.query("insert into public.catalog_live(id,document,source_revision) values('main',$1::jsonb,1)",[JSON.stringify(publicDocument(initialDocument))]);
});
after(async()=>{await db.close();});
test('Public config accepts only a publishable key and a Supabase HTTPS project',()=>{
  assert.equal(validateConfig({enabled:false}),null);
  assert.throws(()=>validateConfig({enabled:false,serviceKey:'secret'}));
  assert.throws(()=>validateConfig(null));
  assert.throws(()=>validateConfig({url:'https://example.com',publishableKey:'sb_secret_private',bucket:'catalog-media'}));
  assert.throws(()=>validateConfig({url:'https://valid.supabase.co',publishableKey:'eyJserviceRole',bucket:'catalog-media'}));
  assert.equal(validateConfig({url:'https://valid.supabase.co',publishableKey:'sb_publishable_test',bucket:'catalog-media'})?.bucket,'catalog-media');
});
test('Schema rejects remote/active images, duplicate IDs, unknown fields and missing content',()=>{
  assert.equal(documentSchema.safeParse(initialDocument).success,true);
  for(const invalid of ['javascript:alert(1)','https://other.site/image.png','media:../secret.svg','data:image/svg+xml,svg']) {
    const doc=structuredClone(initialDocument);doc.products[0].image=invalid;assert.equal(documentSchema.safeParse(doc).success,false);
  }
  const duplicate=structuredClone(initialDocument);duplicate.products.push(duplicate.products[0]);assert.equal(documentSchema.safeParse(duplicate).success,false);
  assert.equal(documentSchema.safeParse({...initialDocument,serviceKey:'secret'}).success,false);
});
test('Anonymous visitors can only read the published snapshot',async()=>{
  await identity('anon');
  assert.equal((await db.query('select * from public.catalog_live')).rows.length,1);
  await assert.rejects(db.query('select * from public.cms_drafts'),/permission denied/);
  await assert.rejects(db.query('select * from public.cms_revisions'),/permission denied/);
  await assert.rejects(db.query('select * from public.cms_admins'),/permission denied/);
  await assert.rejects(db.query('select public.publish_catalog(1)'),/permission denied/);
  await assert.rejects(db.query('select public.save_catalog_draft(1,$1::jsonb)',[JSON.stringify(initialDocument)]),/permission denied/);
  await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('catalog-media',$1)",[asset]),/row-level security/);
});
test('Authenticated non-admin, even with MFA, cannot read drafts, mutate, list media or elevate permissions',async()=>{
  await identity('authenticated',outsider,'aal2');
  assert.deepEqual((await db.query('select public.is_catalog_member() as member')).rows,[{member:false}]);
  assert.equal((await db.query('select * from public.cms_drafts')).rows.length,0);
  assert.equal((await db.query('select * from public.cms_revisions')).rows.length,0);
  await assert.rejects(db.query('select public.publish_catalog(1)'),/FORBIDDEN/);
  await assert.rejects(db.query('select public.save_catalog_draft(1,$1::jsonb)',[JSON.stringify(initialDocument)]),/FORBIDDEN/);
  await assert.rejects(db.query('select * from public.list_catalog_media()'),/FORBIDDEN/);
  await assert.rejects(db.query('insert into public.cms_admins(user_id) values($1)',[outsider]),/permission denied/);
});
test('Administrator with only first factor is blocked by the database, not just the UI',async()=>{
  await identity('authenticated',admin,'aal1');
  assert.deepEqual((await db.query('select public.is_catalog_member() as member')).rows,[{member:true}]);
  assert.equal((await db.query('select * from public.cms_drafts')).rows.length,0);
  await assert.rejects(db.query('select public.publish_catalog(1)'),/FORBIDDEN/);
  await assert.rejects(db.query('select public.save_catalog_draft(1,$1::jsonb)',[JSON.stringify(initialDocument)]),/FORBIDDEN/);
  await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('catalog-media',$1)",[asset]),/row-level security/);
});
test('MFA administrator saves with revision lock; stale writes and direct writes fail',async()=>{
  await identity('authenticated',admin,'aal2');
  assert.equal((await db.query('select * from public.cms_drafts')).rows.length,1);
  const draft=structuredClone(initialDocument);draft.home.heroTitle='Yeni başlık';draft.products[0].published=false;draft.products[1].image=`media:${asset}`;
  const {rows}=await db.query<{result:{revision:number}}>('select public.save_catalog_draft(1,$1::jsonb) result',[JSON.stringify(draft)]);
  assert.equal(rows[0].result.revision,2);
  await assert.rejects(db.query('select public.save_catalog_draft(1,$1::jsonb)',[JSON.stringify(initialDocument)]),/REVISION_CONFLICT/);
  await assert.rejects(db.query("update public.catalog_live set document='{}'"),/permission denied/);
  await assert.rejects(db.query("update public.cms_drafts set document='{}'"),/permission denied/);
  await assert.rejects(db.query("delete from public.cms_revisions"),/permission denied/);
});
test('Server rejects malformed documents even if frontend validation is bypassed',async()=>{
  await identity('authenticated',admin,'aal2');
  const docs:unknown[]=[{},null,[],{...initialDocument,extra:'secret'}];
  const badImage=structuredClone(initialDocument);badImage.home.heroImage='https://untrusted.invalid/a.svg';docs.push(badImage);
  const invalidId=structuredClone(initialDocument);invalidId.products[0].id='../x';docs.push(invalidId);
  const noBoolean=structuredClone(initialDocument) as any;noBoolean.products[0].published=null;docs.push(noBoolean);
  const noTitle=structuredClone(initialDocument) as any;noTitle.home.heroTitle=null;docs.push(noTitle);
  for(const doc of docs) await assert.rejects(db.query('select public.save_catalog_draft(2,$1::jsonb)',[JSON.stringify(doc)]),/INVALID_DOCUMENT/);
});
test('Publish is atomic, idempotent and excludes hidden products from public document and featured selection',async()=>{
  await identity('authenticated',admin,'aal2');
  await assert.rejects(db.query('select public.publish_catalog(1)'),/REVISION_CONFLICT/);
  await db.query('select public.publish_catalog(2)');await db.query('select public.publish_catalog(2)');
  assert.equal((await db.query('select * from public.cms_revisions')).rows.length,1);
  await identity('anon');
  const {rows}=await db.query<{document:typeof initialDocument}>('select document from public.catalog_live');
  assert.equal(rows[0].document.home.heroTitle,'Yeni başlık');
  assert.equal(rows[0].document.products.length,12);
  assert.equal(rows[0].document.home.featuredIds.includes(initialDocument.products[0].id),false);
  assert.equal(rows[0].document.products.some(p=>!p.published),false);
});
test('Storage restricts folders/extensions, prevents overwrite and protects all referenced versions',async()=>{
  await identity('authenticated',admin,'aal2');
  for(const name of [`${outsider}/cccccccc-cccc-4ccc-8ccc-cccccccccccc.webp`,`${admin}/bad.svg`,`${admin}/../secret.webp`])
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('catalog-media',$1)",[name]),/row-level security/);
  await db.query("insert into storage.objects(bucket_id,name) values('catalog-media',$1),('catalog-media',$2)",[asset,unused]);
  assert.equal((await db.query('select * from public.list_catalog_media()')).rows.length,2);
  assert.equal((await db.query("update storage.objects set name='overwritten' returning *")).rows.length,0);
  assert.equal((await db.query('delete from storage.objects where name=$1 returning *',[asset])).rows.length,0);
  assert.equal((await db.query('delete from storage.objects where name=$1 returning *',[unused])).rows.length,1);
  await db.query('select public.save_catalog_draft(2,$1::jsonb)',[JSON.stringify(initialDocument)]);
  await db.query('select public.publish_catalog(3)');
  assert.equal((await db.query('delete from storage.objects where name=$1 returning *',[asset])).rows.length,0,'old publication still references the image');
});
test('Restore updates draft only; subsequent publish uses a fresh revision',async()=>{
  await identity('authenticated',admin,'aal2');
  const {rows}=await db.query<{id:number}>('select id from public.cms_revisions where source_revision=2');
  await assert.rejects(db.query('select public.restore_catalog_revision($1,1)',[rows[0].id]),/REVISION_CONFLICT/);
  await db.query('select public.restore_catalog_revision($1,3)',[rows[0].id]);
  const draft=await db.query<{revision:number;document:typeof initialDocument}>('select * from public.cms_drafts');
  assert.equal(draft.rows[0].revision,4);assert.equal(draft.rows[0].document.home.heroTitle,'Yeni başlık');
  const live=await db.query<{document:typeof initialDocument}>('select document from public.catalog_live');
  assert.equal(live.rows[0].document.home.heroTitle,initialDocument.home.heroTitle);
});
test('Revoking membership immediately blocks existing MFA sessions',async()=>{
  await identity('postgres');await db.query('delete from public.cms_admins where user_id=$1',[admin]);
  await identity('authenticated',admin,'aal2');
  assert.equal((await db.query('select * from public.cms_drafts')).rows.length,0);
  await assert.rejects(db.query('select public.publish_catalog(4)'),/FORBIDDEN/);
});
