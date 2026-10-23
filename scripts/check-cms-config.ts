import { readFile } from 'node:fs/promises';
import { validateConfig } from '../src/cms/config';
const config=validateConfig(JSON.parse(await readFile(new URL('../public/cms-config.json',import.meta.url),'utf8')));
console.log(config?'CMS public yapılandırması doğrulandı.':'CMS bağlantısı kapalı; mevcut katalog kullanılır.');
