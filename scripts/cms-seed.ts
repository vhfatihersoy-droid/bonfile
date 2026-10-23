import { initialDocument, publicDocument } from '../src/cms/model';
const literal=(value:unknown)=>"'"+JSON.stringify(value).replaceAll("'","''")+"'::jsonb";
// Run once with a trusted database connection after migration. Never overwrite existing content.
console.log(`begin;\ninsert into public.cms_drafts(id,document) values('main',${literal(initialDocument)}) on conflict(id) do nothing;\ninsert into public.catalog_live(id,document,source_revision) values('main',${literal(publicDocument(initialDocument))},1) on conflict(id) do nothing;\ncommit;`);
