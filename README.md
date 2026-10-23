# Özlemce — Mağaza ve güvenli yönetim paneli

Güncel mağaza ve yönetim panelinin kaynak kodu **[`site/`](./site)** dizininde yayımlanır.

- [GitHub Pages bağlantısı](https://vhfatihersoy-droid.github.io/bonfile/) — güncel canlı mağazaya yönlenir.
- [Canlı mağaza](https://bonfile.tarimakademi.chatgpt.site/)
- [Yönetim paneli](https://bonfile.tarimakademi.chatgpt.site/#/yonetim)

## Güncel sürüm

Kategori menüsü, ürün araması, gramaj seçimi, tahmini fiyatlar, favoriler ve tarayıcıda korunan sepet içerir. Kilogram fiyatları panelden düzenlenir; paket tutarı seçilen gramaja göre hesaplanır. Fiyatlar tahminidir. Sipariş ve ödeme alınmaz.

Yönetim paneli yetkili ChatGPT hesabıyla açılır. Ürünler, görseller ve ana sayfa içerikleri panelden düzenlenir. Taslak, önizleme, yayın ve sürüm geçmişi korunur. Kalıcı içerik Sites D1, yüklenen görseller Sites R2 üzerinde tutulur.

## Geliştirme

Node.js 22.13 veya üzeri:

```sh
cd site
npm ci
npm run typecheck
npm test
npm run build
```

Canlı Sites sürümü 4 ile eşleşen kaynak commit'i ve yayın bilgileri [`site-source.json`](./site-source.json) dosyasındadır. Yalnızca Git tarafından izlenen kaynaklar ve sabit görseller alınmıştır; oturum bilgileri, ortam sırları, yerel veritabanı ve kullanıcı yüklemeleri bu depoda bulunmaz.

## Yayın yapısı

GitHub Actions güncel `site/` kaynaklarını doğrular ve GitHub Pages yönlendirme sayfasını yayımlar. Pages adresindeki ürün rotası ve sorgu korunur. Güvenli giriş, yönetim API'si ve veritabanı mevcut Sites yayını üzerinde çalışır. GitHub'a kaynak göndermek Sites üretim ortamını otomatik güncellemez; bunun için mevcut Sites kaynak/derleme/paketleme akışı kullanılır.

Kök dizindeki önceki katalog kaynakları ve `docs/` geçmiş sürüm için korunmuştur. Güncel geliştirme için `site/` dizinini kullanın. Supabase kurulumu gerekmez.
