import type {Metadata} from 'next';
import '../src/index.css';
export const metadata:Metadata={title:'Özlemce | Et Entegre Tesisi',description:'Özenle seçin, keyifle hazırlayın. Özlemce ürün kataloğu ve mutfak rehberi.',icons:{icon:'/ozlemce-logo.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>;}
