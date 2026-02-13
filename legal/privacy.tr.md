---
id: "privacy"
locale: "tr"
version: "v2.0"
last_updated: "2026-02-13"
document_title: "Gizlilik Politikası"
---

# Gizlilik Politikası

**Son Güncelleme:** 13 Şubat 2026

## 1. Giriş

Bu Gizlilik Politikası, Qualy platformunu ve ilgili hizmetleri ("Hizmet") kullandığınızda paylaştığınız kişisel verilerin nasıl toplandığını, kullanıldığını, saklandığını ve paylaşıldığını açıklar.

Hizmet, Türkiye Cumhuriyeti'nde kayıtlı bir şahıs işletmesi olan **Seray Aytemiz — Sweet Dreams Fotoğrafçılık** tarafından işletilmektedir ("biz", "bize", "bizim").

| | |
|---|---|
| **Ticaret Ünvanı** | Sweet Dreams Fotoğrafçılık |
| **Sahibi** | Seray Aytemiz |
| **Vergi Dairesi / VKN** | Doğanbey / 8430312977 |
| **Adres** | Çayyolu Mah. 2699 Sk. Oyak 4 Sitesi No: 1 İç Kapı No: 36 Çankaya / Ankara |

Hizmeti kullanarak bu Gizlilik Politikasını okuduğunuzu ve anladığınızı kabul etmiş olursunuz. Kabul etmiyorsanız lütfen Hizmeti kullanmayın.

## 2. Topladığımız Veriler

### 2.1 Hesap Verileri

Hesap oluşturduğunuzda veya yönettiğinizde şunları toplayabiliriz:

- Ad, soyad ve e-posta adresi.
- Giriş kimlik bilgileri ve kimlik doğrulama token'ları.
- Organizasyon adı ve faturalama bilgileri.

### 2.2 Konuşma ve Mesaj Verileri

Siz veya müşterileriniz Qualy üzerinden etkileşim kurduğunda şunları işleyebiliriz:

- Bağlı kanallar (WhatsApp, Telegram, Instagram) üzerinden gelen ve giden mesaj içerikleri.
- Konuşma meta verileri (zaman damgaları, kanal türü, gönderen rolü).
- Mesajlaşma platformları aracılığıyla sağlanan müşteri iletişim bilgileri (ad, telefon numarası).

### 2.3 Yapay Zeka Tarafından İşlenen Veriler

Temel hizmet işlevselliğimiz kapsamında aşağıdaki verileri üretir ve saklarız:

- Yapay zeka tarafından üretilen mesaj önerileri ve otomatik yanıtlar.
- Kişi çıkarım sonuçları: hizmet türü, istenen tarih, konum, bütçe sinyalleri, niyet düzeyi ve risk sinyalleri.
- Kişi değerlendirme puanları (0–10) ve yapay zeka tarafından üretilen konuşma özetleri.
- Yetenek eşleştirme güven puanları ve yönlendirme kararları.
- Bilgi Bankası erişim sonuçları ve vektör gömme (embedding) verileri.

### 2.4 Teknik ve Kullanım Verileri

Şunları toplayabiliriz:

- Cihaz ve tarayıcı bilgileri.
- IP adresi ve yaklaşık konum sinyalleri.
- Log olayları, hata tanılama verileri ve kullanım analitiği.
- Yapay zeka token kullanım metrikleri.

## 3. Yapay Zeka ve Üçüncü Taraf LLM İşleme

### 3.1 Yapay Zeka İşleme Nasıl Çalışır?

Qualy, yapay zeka destekli bir müşteri iletişim ve kişi değerlendirme platformudur. **Konuşmalarınız, mesajlarınız ve müşteri etkileşimleriniz, Hizmetin temel özelliklerini sunmak amacıyla üçüncü taraf büyük dil modeli (LLM) sağlayıcıları tarafından işlenir.** Detaylı olarak:

| Özellik | LLM'ye Gönderilen Veri | Amaç |
|---|---|---|
| **Otomatik Yanıt Motoru** | Müşteri mesajları, yetenek tanımları, bilgi bankası içeriği | Müşteri sorularına bağlamsal yanıtlar üretmek |
| **Kişi Çıkarımı** | Konuşma geçmişi (son 5 müşteri mesajı + son rol etiketli mesajlar) | Hizmet türü, tarih, konum, bütçe, niyet ve risk sinyallerini çıkarmak |
| **Kişi Puanlama** | Çıkarılan kişi sinyalleri ve konuşma anlık görüntüsü | 0–10 değerlendirme puanı ve durum sınıflandırması üretmek |
| **Bilgi Bankası (RAG)** | Müşteri soruları + ilgili bilgi parçacıkları | Yüklediğiniz SSS/politikalardan dayanaklı yanıtlar üretmek |
| **Konuşma Özeti** | Tam konuşma geçmişi | İsteğe bağlı konuşma özetleri üretmek |
| **Hizmet Profili** | Yetenekler, bilgi bankası içeriği | Hizmet sunumu önerileri üretmek |
| **Gerekli Alanlar** | Yetenekler, bilgi bankası içeriği, mevcut alanlar | Kişi değerlendirmesi için veri toplama alanları önermek |

### 3.2 Üçüncü Taraf LLM Sağlayıcıları

Şu anda kullandığımız sağlayıcılar:

- **OpenAI (OpenAI, L.L.C., San Francisco, ABD)** — Metin üretimi ve çıkarım için GPT-4o-mini modeli; anlamsal arama ve yetenek eşleştirme için metin gömme (embedding) modelleri.

Gelecekte LLM sağlayıcılarını değiştirebilir veya yenilerini ekleyebiliriz. Böyle bir değişiklik bu Gizlilik Politikasının güncellenmesiyle yansıtılacaktır.

### 3.3 Bunun Sizin için Anlamı

- Bağlı kanallarınızdan gelen konuşma içerikleri, işlenmek üzere OpenAI'ın **Amerika Birleşik Devletleri**'nde bulunan API sunucularına iletilir.
- OpenAI'ın API hizmetini kullanıyoruz (tüketici ürünü ChatGPT değil). OpenAI'ın API veri kullanım politikasına göre API verileri modellerini eğitmek için kullanılmaz.
- İşlenmiş çıktılar (yanıtlar, puanlar, özetler) veri tabanımızda saklanır.
- Son kullanıcılarınızı, konuşmalarının yapay zeka sistemleri tarafından işlenebileceği konusunda bilgilendirmek sizin sorumluluğunuzdadır.

## 4. Verileri Nasıl Kullanıyoruz

Kişisel verileri şu amaçlarla kullanırız:

- Hizmeti sunmak, sürdürmek ve geliştirmek.
- Kullanıcıları doğrulamak ve hesap güvenliğini sağlamak.
- Yapay zeka destekli özellikler sunmak (otomatik yanıt, kişi çıkarımı, puanlama, konuşma özetleri).
- Kanal entegrasyonlarını çalıştırmak (WhatsApp, Telegram, Instagram).
- Kullanım analitiği ve faturalama bilgisi üretmek.
- Kötüye kullanım, dolandırıcılık ve güvenlik ihlallerini önlemek.
- Hukuki yükümlülüklere uymak.

## 5. Hukuki Dayanaklar

### 5.1 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)

Kişisel verilerinizi 6698 sayılı KVKK kapsamında aşağıdaki hukuki dayanaklara göre işliyoruz:

- **Açık rıza** (KVKK m.5/1): Özellikle yurt dışına veri aktarımı ve yapay zeka ile işleme için.
- **Sözleşmenin ifası** (KVKK m.5/2-c): Hizmetin sunulması için gerekli veri işleme.
- **Hukuki yükümlülük** (KVKK m.5/2-ç): Yasal zorunlulukların yerine getirilmesi.
- **Meşru menfaat** (KVKK m.5/2-f): Temel hak ve özgürlüklere zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri.

**Veri Sorumlusu:** Seray Aytemiz — Sweet Dreams Fotoğrafçılık
**VKN:** 8430312977

### 5.2 GDPR (Uygulanabildiği Ölçüde)

AEA'daki bireyler için:

- Sözleşmenin ifası.
- Meşru menfaatler.
- Hukuki yükümlülükler.
- Rıza (gerektiği durumlarda).

## 6. Verileri Nasıl Paylaşıyoruz

Verileri aşağıdaki üçüncü taraf kategorileriyle paylaşabiliriz:

| Kategori | Örnekler | Amaç |
|---|---|---|
| **Yapay Zeka / LLM Sağlayıcıları** | OpenAI | Yapay zeka çıkarımı, gömme (embedding) üretimi |
| **Bulut Altyapı** | Supabase (PostgreSQL, Auth, Storage), Vercel | Barındırma, veri tabanı, kimlik doğrulama |
| **Mesajlaşma Platformları** | Meta (WhatsApp, Instagram), Telegram | Kanal bağlantısı, mesaj iletimi |
| **Analitik** | Kullanım izleme araçları | Performans izleme |
| **Hukuki/Profesyonel** | Danışmanlar, denetçiler | Gizlilik yükümlülüğü kapsamında |
| **Yetkili Makamlar** | Devlet kurumları | Hukuken zorunlu olduğunda veya geçerli yasal süreçlerde |

Kişisel verileri satmayız.

## 7. Yurt Dışına Veri Aktarımı

Verileriniz Türkiye dışındaki ülkelere aktarılabilir ve bu ülkelerde işlenebilir, bunlar arasında:

- **Amerika Birleşik Devletleri** — OpenAI API işleme, Vercel barındırma, Supabase altyapısı.

KVKK m.9 kapsamında yurt dışına veri aktarımı için:

- İlgili kişinin **açık rızası** alınır.
- Veri aktarılan ülkede yeterli korumanın bulunması veya yeterli korumanın taahhüt edilmesi halinde Kişisel Verileri Koruma Kurulu'nun iznine başvurulur.
- Hizmet sağlayıcılarla veri işleme sözleşmeleri yapılır.

## 8. Veri Saklama

Kişisel verileri şu süreler boyunca saklarız:

- Hizmeti sunmak ve hesabınızı sürdürmek için gerekli olduğu sürece.
- Sözleşmesel ve yasal yükümlülükleri yerine getirmek için gerekli olduğu sürece.
- Uyuşmazlıkları çözmek için gerekli olduğu sürece.

Konuşma verileri ve yapay zeka işleme çıktıları aboneliğiniz süresince saklanır. Hesap silme işleminden sonra verileriniz, yasal bir saklama zorunluluğu bulunmadığı sürece 30 gün içinde silinir veya anonim hale getirilir.

## 9. Güvenlik

Kişisel verileri korumak için aşağıdaki teknik ve organizasyonel önlemleri uyguluyoruz:

- Şifreli veri iletimi (TLS/HTTPS).
- Çoklu kiracı veri izolasyonu için satır düzeyinde güvenlik (RLS).
- Güvenli oturum yönetimi ile kimlik doğrulama.

Hiçbir iletim veya saklama yöntemi tamamen güvenli değildir. Mutlak güvenlik garanti edilemez.

## 10. Gizlilik Haklarınız

### 10.1 KVKK Kapsamında Haklarınız (KVKK m.11)

Aşağıdaki haklara sahipsiniz:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme.
- İşlenmişse buna ilişkin bilgi talep etme.
- İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme.
- Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme.
- Eksik veya yanlış işlenen kişisel verilerinizin düzeltilmesini isteme.
- KVKK m.7 kapsamında kişisel verilerinizin silinmesini veya yok edilmesini isteme.
- Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme.
- İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.
- Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme.

### 10.2 GDPR Kapsamında (AEA'daki Kişiler)

Erişim, düzeltme, silme, işleme kısıtlama, veri taşınabilirliği ve rızayı geri çekme haklarınız olabilir.

Haklarınızı kullanmak için: **privacy@askqualy.com**

## 11. Çerezler ve Benzer Teknolojiler

Şu amaçlarla çerez ve benzeri teknolojiler kullanabiliriz:

- Oturumları aktif tutmak.
- Tercihleri hatırlamak.
- Performans ve kullanım ölçümü yapmak.

Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.

## 12. Çocuklar

Hizmet 18 yaşın altındaki bireyler için tasarlanmamıştır. Çocuklardan bilerek kişisel veri toplamayız.

## 13. Bu Politikadaki Değişiklikler

Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Esaslı değişikliklerde `son güncelleme` tarihini güncelleriz. Güncellemeler sonrası Hizmeti kullanmaya devam etmeniz, revize Politikayı kabul ettiğiniz anlamına gelir.

## 14. İletişim

Gizlilikle ilgili sorularınız, veri erişim talepleriniz veya şikayetleriniz için:

- **E-posta:** privacy@askqualy.com
- **Hukuki:** legal@askqualy.com
- **Adres:** Çayyolu Mah. 2699 Sk. Oyak 4 Sitesi No: 1 İç Kapı No: 36 Çankaya / Ankara

**KVKK kapsamında başvurularınızı** yazılı olarak yukarıdaki adrese, kayıtlı elektronik posta (KEP) ile veya privacy@askqualy.com adresine kimliğinizi doğrulayan belgelerle birlikte iletebilirsiniz.
