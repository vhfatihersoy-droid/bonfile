# Özlemce içerik yönetimi

Bu dizin GitHub Pages kataloğunun Supabase altyapısını içerir. Mevcut demo stüdyosu ve yerel PIN girişi bu uygulamaya dahil değildir.

## Canlı kurulum

1. Bonfile için ayrılmış Supabase projesini doğrulayın. Başka bir projenin kullanıcı, politika veya verilerini değiştirmeyin.
2. `migrations/202610230001_catalog_cms.sql` dosyasını güvenilir SQL bağlantısı üzerinden migration olarak uygulayın.
3. `pnpm cms:seed` çıktısını aynı projede çalıştırın. Seed var olan taslağı veya yayını değiştirmez. SQL çıktısını kod incelemesinden geçirin.
4. Supabase Auth'ta genel kaydı ve anonim girişi kapatın. E-posta OTP açık, TOTP MFA açık olmalı. OTP ömrünü 600 saniye, deneme/gönderim oranlarını sağlayıcı kısıtlarıyla sınırlı tutun.
5. Magic Link e-posta şablonunu kod gösterecek şekilde ayarlayın: `Özlemce giriş kodunuz: {{ .Token }}`. Bu uygulama bağlantı geri çağrısı veya şifre formu kullanmaz. E-posta kodunu uygulamadaki alana girerek doğrular. Site URL: `https://vhfatihersoy-droid.github.io/bonfile/`.
6. Yetkili kullanıcıyı Supabase Auth yönetim aracıyla oluşturun. Parola veya servis anahtarı repoya yazılmaz. Onaylı e-posta adresini kullanıcı talebinden alın, repoda sabitlemeyin. Auth tarafından döndürülen gerçek kullanıcı UUID'sini `cms_admins` tablosuna güvenilir SQL bağlantısıyla ekleyin. Kullanıcı e-postasını ve UUID'sini eşleştirmeden rol vermeyin. İstemciden üyelik veya yetki verme işlevi yoktur.
7. E-posta teslimatını doğrulayın. Supabase'in varsayılan e-posta servisi alıcı ve gönderim sınırlarına tabidir; sağlayıcı izin vermiyorsa projeye ait SMTP gerekir. Kodlar loga veya sohbete yazılmaz.
8. `public/cms-config.json` dosyasına yalnızca public proje URL'si, `sb_publishable_` anahtarı ve `catalog-media` bucket adını yazın. `service_role`, JWT veya `sb_secret_` anahtarını tarayıcıya vermeyin. Bağlantı yokken yapılandırma `{"enabled":false}` kalır.
9. `pnpm typecheck`, `pnpm test`, `pnpm build` çalıştırın. Gerçek anon istemciyle yayın okunabildiğini; taslak, rol, yayınlama ve görsel yüklemenin reddedildiğini kontrol edin. Yetkisiz ve yalnızca birinci faktörü tamamlayan hesapları da sınayın.
10. Kullanıcı `#/yonetim` ekranında e-posta kodunu kendisi girer, doğrulayıcı uygulamasını bağlar ve güncel TOTP kodunu girer. Gerçek ürün/görsel/ana sayfa kaydını taslakta, yayımlamayı katalogda doğrulayın. Geçici test içeriğini yayımlamayın; görsel ve içerik için gerçek örnek seçin.
11. Yalnızca yeni CMS ve katalog değişikliklerini yayımlayın. Eski demo, ödeme ve yerel PIN dosyaları yayın kapsamına dahil edilmez. GitHub Actions deploy sonucu başarılı olduktan sonra gerçek URL'de giriş, yetkisiz erişim ve kalıcılık doğrulanır.

## Yetki modeli

- `cms_admins`: Yönetici UUID listesi; tarayıcı rollerine okuma/yazma izni yok. Üyelik RPC'si yalnızca çağıran kişinin üyeliğini döndürür.
- `cms_drafts` ve `cms_revisions`: Sadece üye ve `aal2` oturumu okuyabilir. Doğrudan yazılamaz. Kaydet, yayımla ve geri al RPC'leri her çağrıda yetkiyi kontrol eder.
- `catalog_live`: Anonim salt okunur yayın. Gizli ürünler ve onların öne çıkan ürün referansları yayın sırasında çıkarılır. Boş katalog da geçerlidir; istemci eski statik ürünlere dönmez.
- Yayın atomiktir; taslak revizyonu eşleşmezse kayıt reddedilir. Yayın geçmişi değiştirilemez. Geri alma yalnızca taslağı değiştirir.
- `catalog-media`: Herkese açık görseller. Yükleme/silme yönetici + MFA gerektirir. Görseller en fazla 5 MB, JPG/PNG/WebP. İstemci dosyayı yeniden WebP olarak üretir, üst verileri siler ve en fazla 2400 px'e küçültür. Üzerine yazılamaz; taslak, yayın veya yayın geçmişindeki görseller silinemez.
- Oturum sekmeye ait sessionStorage'da tutulur; 30 dakika etkileşimsizlikte arayüz çıkış yapar. Veritabanındaki üyelik iptali mevcut oturumların sonraki isteklerini de engeller. Token süresi ve sunucu oturum sınırları Auth ayarlarıdır.

## İşletim ve kurtarma

Panelden taslak JSON dosyası indirilebilir. Yayın geçmişi uygulama içi geri alma sağlar; sağlayıcı yedeğinin yerine geçmez. Veritabanı ve storage yedeklerini kullanılan Supabase planına göre ayrıca kurun. Doğrulayıcı kaybında proje sahibi, kimliği hesap dışında doğruladıktan sonra Supabase Auth yönetimi üzerinden MFA faktörünü sıfırlar. Panelde MFA atlatma veya genel kayıt yolu yoktur.

Yerel `security.test.ts`, PGlite PostgreSQL motorunda üretim migration dosyasını aynen çalıştırır. Auth claim işlevleri ve storage şeması test ortamında taklit edilir; bu testler gerçek Supabase Auth, e-posta teslimatı, Storage HTTP servisi veya canlı erişim doğrulamasının yerine geçmez.
