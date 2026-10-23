-- Dedicated Bonfile project. No client can assign administrators.
create table public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cms_admins enable row level security;
revoke all on public.cms_admins from anon, authenticated;

create function public.is_catalog_member() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.cms_admins where user_id = (select auth.uid()));
$$;
create function public.has_catalog_access() returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_catalog_member() and coalesce((select auth.jwt())->>'aal' = 'aal2', false);
$$;
revoke all on function public.is_catalog_member(), public.has_catalog_access() from public, anon;
grant execute on function public.is_catalog_member(), public.has_catalog_access() to authenticated;

create function public.catalog_image_valid(value text) returns boolean language sql immutable set search_path = '' as $$
  select coalesce(value in ('steak','bonfile','izgara','kuzu','kofte','burger','sarkuteri','doner','kemikli','pastirma','sofra')
    or value ~ '^media:[a-f0-9-]{36}/[a-f0-9-]{36}\.(jpg|png|webp)$', false);
$$;
create function public.catalog_document_valid(doc jsonb) returns boolean language plpgsql immutable set search_path = '' as $$
declare p jsonb; h jsonb; k text; item jsonb; ids text[] := '{}'; max_length integer;
begin
  if doc is null or jsonb_typeof(doc) <> 'object' then return false; end if;
  if doc->'schemaVersion' is distinct from '1'::jsonb or not(doc ?& array['schemaVersion','products','home']) or
    (doc - array['schemaVersion','products','home']) <> '{}'::jsonb then return false; end if;
  if jsonb_typeof(doc->'products') <> 'array' or jsonb_typeof(doc->'home') <> 'object' then return false; end if;
  if jsonb_array_length(doc->'products') > 300 or octet_length(doc::text) > 2097152 then return false; end if;
  for p in select value from jsonb_array_elements(doc->'products') loop
    if jsonb_typeof(p) <> 'object' then return false; end if;
    if not(p ?& array['id','name','category','image','summary','description','cut','methods','weights','published']) or
      (p - array['id','name','category','image','summary','description','cut','methods','weights','published']) <> '{}'::jsonb then return false; end if;
    foreach k in array array['id','name','category','image','summary','description','cut'] loop
      max_length := case k when 'description' then 3000 when 'summary' then 240 when 'id' then 100 when 'image' then 100 else 120 end;
      if jsonb_typeof(p->k) <> 'string' or length(btrim(p->>k)) < 1 or length(p->>k) > max_length then return false; end if;
    end loop;
    if p->>'id' !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or (p->>'id') = any(ids) then return false; end if;
    ids := array_append(ids,p->>'id');
    if p->>'category' not in ('steak','beef','lamb','meatball','charcuterie','doner','horeca') or not public.catalog_image_valid(p->>'image') then return false; end if;
    if jsonb_typeof(p->'published') <> 'boolean' or jsonb_typeof(p->'methods') <> 'array' or jsonb_typeof(p->'weights') <> 'array' then return false; end if;
    if jsonb_array_length(p->'methods') not between 1 and 5 or jsonb_array_length(p->'weights') > 20 then return false; end if;
    for item in select value from jsonb_array_elements(p->'methods') loop
      if jsonb_typeof(item) <> 'string' or (item #>> '{}') not in ('Tava','Izgara','Fırın','Tencere','Servis') then return false; end if;
    end loop;
    for item in select value from jsonb_array_elements(p->'weights') loop
      if jsonb_typeof(item) <> 'string' or length(btrim(item #>> '{}')) not between 1 and 50 then return false; end if;
    end loop;
  end loop;
  h := doc->'home';
  if not(h ?& array['heroEyebrow','heroTitle','heroAccent','heroDescription','heroButton','heroImage','heroImageAlt','heroCaption','categoriesTitle','featuredTitle','featuredDescription','featuredIds','editorialEyebrow','editorialTitle','editorialAccent','editorialDescription','editorialButton','editorialImage','editorialImageAlt','brandTitle','brandAccent']) or
    (h - array['heroEyebrow','heroTitle','heroAccent','heroDescription','heroButton','heroImage','heroImageAlt','heroCaption','categoriesTitle','featuredTitle','featuredDescription','featuredIds','editorialEyebrow','editorialTitle','editorialAccent','editorialDescription','editorialButton','editorialImage','editorialImageAlt','brandTitle','brandAccent']) <> '{}'::jsonb then return false; end if;
  for k in select jsonb_object_keys(h - 'featuredIds') loop
    max_length := case k when 'heroEyebrow' then 100 when 'heroAccent' then 100 when 'heroDescription' then 400 when 'heroButton' then 80 when 'heroImage' then 100 when 'heroImageAlt' then 200 when 'heroCaption' then 120 when 'featuredDescription' then 300 when 'editorialEyebrow' then 100 when 'editorialAccent' then 100 when 'editorialDescription' then 500 when 'editorialButton' then 80 when 'editorialImage' then 100 when 'editorialImageAlt' then 200 else 140 end;
    if jsonb_typeof(h->k) <> 'string' or length(btrim(h->>k)) not between 1 and max_length then return false; end if;
  end loop;
  if not public.catalog_image_valid(h->>'heroImage') or not public.catalog_image_valid(h->>'editorialImage') then return false; end if;
  if jsonb_typeof(h->'featuredIds') <> 'array' then return false; end if;
  if jsonb_array_length(h->'featuredIds') > 8 then return false; end if;
  for item in select value from jsonb_array_elements(h->'featuredIds') loop
    if jsonb_typeof(item) <> 'string' or not((item #>> '{}') = any(ids)) then return false; end if;
  end loop;
  if (select count(*) <> count(distinct value) from jsonb_array_elements(h->'featuredIds')) then return false; end if;
  return true;
exception when others then return false;
end;
$$;
revoke all on function public.catalog_document_valid(jsonb), public.catalog_image_valid(text) from public, anon, authenticated;

create table public.cms_drafts (
  id text primary key check(id='main'), document jsonb not null check(public.catalog_document_valid(document)),
  revision bigint not null default 1, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id) on delete set null
);
create table public.cms_revisions (
  id bigint generated always as identity primary key, document jsonb not null,
  source_revision bigint not null unique, published_at timestamptz not null default now(), published_by uuid references auth.users(id) on delete set null
);
create table public.catalog_live (
  id text primary key check(id='main'), document jsonb not null, source_revision bigint not null,
  published_at timestamptz not null default now()
);
alter table public.cms_drafts enable row level security;
alter table public.cms_revisions enable row level security;
alter table public.catalog_live enable row level security;
revoke all on public.cms_drafts, public.cms_revisions, public.catalog_live from anon, authenticated;
grant select on public.cms_drafts, public.cms_revisions to authenticated;
grant select on public.catalog_live to anon, authenticated;
create policy "Admin MFA reads drafts" on public.cms_drafts for select to authenticated using ((select public.has_catalog_access()));
create policy "Admin MFA reads history" on public.cms_revisions for select to authenticated using ((select public.has_catalog_access()));
create policy "Public reads published catalog" on public.catalog_live for select to anon, authenticated using (true);

create function public.save_catalog_draft(expected_revision bigint, new_document jsonb) returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_revision bigint; result jsonb;
begin
  if not public.has_catalog_access() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if not public.catalog_document_valid(new_document) then raise exception 'INVALID_DOCUMENT' using errcode='22023'; end if;
  select revision into current_revision from public.cms_drafts where id='main' for update;
  if current_revision is distinct from expected_revision then raise exception 'REVISION_CONFLICT' using errcode='40001'; end if;
  update public.cms_drafts set document=new_document, revision=revision+1, updated_at=now(),updated_by=auth.uid() where id='main'
    returning jsonb_build_object('document',document,'revision',revision,'updated_at',updated_at) into result;
  return result;
end;
$$;
create function public.publish_catalog(expected_revision bigint) returns bigint language plpgsql security definer set search_path = '' as $$
declare draft public.cms_drafts%rowtype; published jsonb; products jsonb; featured jsonb; publication bigint;
begin
  if not public.has_catalog_access() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into draft from public.cms_drafts where id='main' for update;
  if draft.revision is distinct from expected_revision then raise exception 'REVISION_CONFLICT' using errcode='40001'; end if;
  if not public.catalog_document_valid(draft.document) then raise exception 'INVALID_DOCUMENT'; end if;
  select coalesce(jsonb_agg(value order by ordinal),'[]'::jsonb) into products from jsonb_array_elements(draft.document->'products') with ordinality as p(value,ordinal) where value->>'published'='true';
  select coalesce(jsonb_agg(f.value order by f.ordinal),'[]'::jsonb) into featured from jsonb_array_elements(draft.document->'home'->'featuredIds') with ordinality as f(value,ordinal)
    where exists(select 1 from jsonb_array_elements(products) p where p->>'id'=f.value #>> '{}');
  published := jsonb_set(jsonb_set(draft.document,'{products}',products),'{home,featuredIds}',featured);
  insert into public.cms_revisions(document,source_revision,published_by) values(draft.document,draft.revision,auth.uid())
    on conflict (source_revision) do nothing returning id into publication;
  if publication is null then select id into publication from public.cms_revisions where source_revision=draft.revision; end if;
  insert into public.catalog_live(id,document,source_revision) values('main',published,draft.revision)
    on conflict(id) do update set document=excluded.document,source_revision=excluded.source_revision,published_at=now();
  return publication;
end;
$$;
create function public.restore_catalog_revision(publication_id bigint, expected_revision bigint) returns jsonb language plpgsql security definer set search_path = '' as $$
declare old_document jsonb;
begin
  if not public.has_catalog_access() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select document into old_document from public.cms_revisions where id=publication_id;
  if old_document is null then raise exception 'REVISION_NOT_FOUND'; end if;
  return public.save_catalog_draft(expected_revision,old_document);
end;
$$;
revoke all on function public.save_catalog_draft(bigint,jsonb), public.publish_catalog(bigint), public.restore_catalog_revision(bigint,bigint) from public, anon;
grant execute on function public.save_catalog_draft(bigint,jsonb), public.publish_catalog(bigint), public.restore_catalog_revision(bigint,bigint) to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
  values ('catalog-media','catalog-media',true,5242880,array['image/jpeg','image/png','image/webp']);
create function public.catalog_media_in_use(object_name text) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1 from (select document from public.cms_drafts union all select document from public.cms_revisions union all select document from public.catalog_live) docs
    where jsonb_path_exists(document,'$.** ? (@ == $image)',jsonb_build_object('image','media:' || object_name))
  );
$$;
revoke all on function public.catalog_media_in_use(text) from public, anon;
grant execute on function public.catalog_media_in_use(text) to authenticated;
create policy "Admin MFA lists media" on storage.objects for select to authenticated using (bucket_id='catalog-media' and (select public.has_catalog_access()));
create policy "Admin MFA uploads immutable images" on storage.objects for insert to authenticated with check (
  bucket_id='catalog-media' and (select public.has_catalog_access()) and
  split_part(name,'/',1)=(select auth.uid())::text and name ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}\.(jpg|png|webp)$'
);
create policy "Admin MFA deletes unreferenced media" on storage.objects for delete to authenticated using (
  bucket_id='catalog-media' and (select public.has_catalog_access()) and not public.catalog_media_in_use(name)
);
-- No UPDATE policy: referenced media cannot be overwritten.
create function public.list_catalog_media() returns table(name text) language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.has_catalog_access() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  return query select o.name from storage.objects o where o.bucket_id='catalog-media' order by o.created_at desc limit 1000;
end;
$$;
revoke all on function public.list_catalog_media() from public, anon;
grant execute on function public.list_catalog_media() to authenticated;
