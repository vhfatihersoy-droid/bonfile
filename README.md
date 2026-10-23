# Özlemce — Canlı mağaza ve güvenli yönetim paneli

**[Canlı mağaza](https://vhfatihersoy-droid.github.io/bonfile/)** doğrudan GitHub Pages üzerinde çalışır. Güncel kaynak kodu **[`site/`](./site)** dizinindedir.

- [Mağaza](https://vhfatihersoy-droid.github.io/bonfile/)
- [Güvenli yönetim paneli](https://bonfile.tarimakademi.chatgpt.site/#/yonetim)

## Mağaza

Kategori menüsü, ürün araması, gramaj seçimi, tahmini fiyatlar, favoriler ve tarayıcıda korunan sepet içerir. Kilogram fiyatları panelden düzenlenir; paket tutarı seçilen gramaja göre hesaplanır. Fiyatlar tahminidir. Sipariş ve ödeme henüz alınmaz.

Ürünler, fiyatlar ve ana sayfa içerikleri mevcut yönetim panelinden yayımlanır. GitHub mağazası açıldığında yayımlanmış kataloğu Sites API üzerinden okur. İçerik değişiklikleri için GitHub derlemesi gerekmez; açık mağaza sayfasını yenilemek yeterlidir.

## Yönetim ve veriler

Yönetim paneli yetkili ChatGPT hesabıyla açılır. Ürünler, görseller ve ana sayfa içerikleri panelden düzenlenir. Taslak, önizleme, yayın ve sürüm geçmişi korunur. Kalıcı içerik Sites D1, yüklenen görseller Sites R2 üzerinde tutulur. Yönetim bağlantısı güvenli Sites adresini açar; normal ürün sayfaları GitHub Pages adresinde kalır.

Katalog API'si yalnızca yayımlanmış bilgileri GitHub Pages kökenine açar. Yönetim uçları ve yazma işlemleri bu çapraz köken erişimine dahil değildir. Oturum bilgileri, ortam sırları, yerel veritabanı ve kullanıcı yüklemeleri depoya konulmaz.

## Geliştirme

Node.js 22.13 veya üzeri:

```sh
cd site
npm ci
npm run typecheck
npm test
npm run build:pages
npm run preview:pages
```

Statik mağaza çıktısı `site/dist-pages/` dizinindedir. GitHub depo yolu `/bonfile/`, katalog adresi ise `vite.pages.config.ts` içinde tanımlıdır. Canlı katalog yalnızca gerçek GitHub Pages kökenine izin verir; yerel önizleme varlık ve görünüm kontrolü içindir. Backend geliştirmesi ve tam yerel CMS testi için `site/README.md` içindeki Sites akışını kullanın. `npm run build` Sites sunuculu uygulamasını derler.

## Yayın

GitHub Actions `main` dalındaki kaynakları doğrular, testleri ve iki derlemeyi çalıştırır; gerçek mağazanın `site/dist-pages/` çıktısını GitHub Pages'e yayımlar. Mağaza ana sayfası başka adrese yönlenmez. Yayımlanan kaynak commit'i ve Sites sürümü [`site-source.json`](./site-source.json) dosyasındadır.

GitHub'a kaynak göndermek Sites backend'ini otomatik güncellemez. Backend değişiklikleri mevcut Sites kaynak/derleme/paketleme akışıyla ayrıca yayımlanır. Kök dizindeki eski katalog ve yönlendirme dosyaları ile `docs/` geçmiş için korunmuştur; güncel Pages yayını bunları kullanmaz. Supabase kurulumu gerekmez.
