'use client';
import {useEffect,useState} from 'react';
import App from '../src/App';
export default function CatalogApp(){const [ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);return ready?<App/>:<main className="catalog-connection">Özlemce kataloğu hazırlanıyor…</main>;}
