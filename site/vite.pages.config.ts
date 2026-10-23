import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  root:fileURLToPath(new URL('./storefront-entry',import.meta.url)),
  base:'/bonfile/',
  publicDir:fileURLToPath(new URL('./public',import.meta.url)),
  plugins:[react()],
  define:{'import.meta.env.VITE_PUBLIC_API_ORIGIN':JSON.stringify('https://bonfile.tarimakademi.chatgpt.site')},
  build:{outDir:fileURLToPath(new URL('./dist-pages',import.meta.url)),emptyOutDir:true},
});
