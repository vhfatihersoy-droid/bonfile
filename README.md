# Bonfile · Özlemce Ürün Kataloğu

Özlemce Et Entegre Tesisi için ürün kataloğu ve marka sitesi. Mevcut React / TypeScript / Vite projesi üzerinde geliştirilmiştir.

Canlı adres: https://vhfatihersoy-droid.github.io/bonfile/

## İlk yayın kapsamı

- Sade ana sayfa, 7 ürün grubu ve 13 ürün kaydı.
- Türkçe karakterleri destekleyen arama, kategori filtreleri ve alfabetik sıralama.
- Paylaşılabilir ürün bağlantıları ve hazırlama yöntemi rehberi.
- Marka, sık sorulan sorular ve gizlilik sayfaları.
- Mobil menü, klavye erişimi, azaltılmış hareket tercihi ve yerel görsel/font dosyaları.

**Bu yayında sipariş, sepet, ödeme, üyelik veya yönetici girişi bulunmaz.** Önceki uygulama Git geçmişinde korunur; üretim giriş noktası eski yönetim veya ödeme bileşenlerini import etmez. `#/admin` gibi tanımsız adresler bulunamadı sayfasına gider. Tarayıcı kayıtlarındaki eski demo verileri canlı kataloğa aktarılmaz.

## Yerelde çalıştırma

Node.js 22.12+ ve pnpm 11.25:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

`dist/` statik yayın çıktısıdır. Ürünler `src/data/catalog.ts`, metin ve sayfa kurgusu `src/App.tsx`, görünüm `src/storefront.css` üzerinden güncellenir. Görsel kaynakları `ASSET-SOURCES.json` dosyasında, Outfit lisansı `src/assets/fonts/OFL.txt` dosyasındadır. Görseller sunum önerisidir; gerçek ürün ambalajı, içerik ve alerjen bilgisi yerine geçmez.

## GitHub Pages yayını

Depo ayarlarında **Pages → Build and deployment → Source: GitHub Actions** kullanılır. `main` dalındaki her değişiklik `.github/workflows/deploy.yml` ile bağımlılık kurulumu, tip kontrolü, test ve derleme sonrası Pages'a yayımlanır. Hash tabanlı gezinme ve göreli dosya yolları `/bonfile/` altında yenileme ve doğrudan ürün bağlantılarının çalışmasını sağlar.

Yayın kontrolü: Actions iş akışının başarıyla tamamlandığını doğrulayın; canlı ana sayfayı, bir ürün bağlantısını ve mobil menüyü kontrol edin. Geri dönüş için önceki kaynak commit'ini geri alan bir commit yayımlayın.

## Sonraki aşama

Sipariş ve yönetim için sunucu veritabanı, kimlik doğrulaması ve rol bazlı yetkilendirme gerekir. Ödeme sağlayıcısı ancak bunlar tamamlandıktan sonra bağlanmalıdır. Bu sürüm böyle bir altyapı varmış gibi davranmaz ve müşteri bilgisi toplamaz.
