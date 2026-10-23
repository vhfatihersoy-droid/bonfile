# Özlemce — Sites kataloğu ve yönetim

Mevcut Özlemce tasarımı ve 13 ürün korunarak GitHub Pages kataloğundan Sites/Vinext altyapısına taşındı. Ödeme ve sipariş kapsam dışıdır.

- Herkese açık katalog: `/#/ana-sayfa`
- İçerik stüdyosu: `/#/yonetim`
- Giriş: Sites'in ChatGPT kimlik doğrulaması. Uygulama şifre veya giriş anahtarı saklamaz.
- Yetki: Sites ortamındaki `ADMIN_BOOTSTRAP_EMAIL` ile seçilmiş hesap ilk girişte Site kapsamındaki sabit kullanıcı kimliğine bağlanır. Sonraki erişim bu kayıt üzerinden denetlenir. Ortam değişkeni gizli tutulur; tarayıcıya gönderilmez.
- Veriler: D1 `DB`; görseller: R2 `BUCKET`. Taslak ve yayımlanmış katalog ayrıdır. İyimser sürüm kontrolü eşzamanlı düzenleme kaybını engeller. Yayın geçmişinden taslağa geri dönülebilir.
- Görseller: tarayıcıda WebP olarak yeniden kodlanır, en fazla 2400 px ve 5 MB. Sunucu MIME, imza ve boyut kontrolü yapar. Taslakta, canlı sitede veya yayın geçmişinde kullanılan bir görsel silinemez.
- API: tüm yönetim işlemleri sunucuda yetki kontrolü yapar; değişiklikler aynı kaynak Origin denetimi gerektirir. Özel yanıtlar önbelleğe alınmaz.

## Geliştirme ve doğrulama

`npm run typecheck`, `npm test`, `npm run build`. Testler SQLite üzerinde gerçek şema ve sorguları; yetki, Origin, çakışma, yayın, geri alma ve görsel korumasını doğrular. R2 nesne arayüzü testlerde bellek adaptörüdür. Yerel tarayıcı testinde Sites'in yalnızca geliştirme için sunduğu `seedy@sites.test` hesabı kullanılır; üretimde bu giriş bulunmaz.

`.dev.vars` yerel ve Git dışında kalır. D1 migrasyonları `drizzle/` altında, şema `db/schema.ts` dosyasındadır. İlk katalog verisi yalnızca boş veritabanına eklenir; mevcut kayıtlar dağıtımlarda değiştirilmez. Yayın Sites'in kaynak/derleme/paketleme araçlarıyla yapılır. Üretim erişim ayarları ve gizli değerler Sites'te yönetilir.
