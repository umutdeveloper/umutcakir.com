---
title: "Senior Developer Olarak AI'ı Kullanma Stratejim"
description: "AI'ı ne zaman kullanıyorum, ne zaman kapatıyorum? 1000+ commit ve 400+ ticket deneyiminden çıkardığım pratik güven skalası ve günlük workflow."
pubDate: 2026-02-23
heroImage: /assets/senior-dev-ai.png
tags: ["ai", "strategy", "senior-developer", "productivity", "software-engineering"]
lang: "tr"
---

## AI Beni Değiştirmedi — Ben AI'ı Şekillendirdim

AI araçlarını ilk kullanmaya başladığımda çoğu developer gibi iki uç arasında gidip geldim: "Bu her şeyi değiştirecek!" ve "Bu işe yaramıyor." İkisi de yanlıştı.

2 yılda 1000+ commit attım, 400+ ticket çözdüm. Bu süreçte AI'ı kullandım — ama her yerde değil. Zamanla nerelerde güvenip nerelerde güvenmemem gerektiğini öğrendim. Bu yazı o öğrenmenin özeti.

---

## İlk Kural: AI Bir Araç, Ortak Değil

Bir çekiç hakkında "çekice güveniyor musun?" diye sormuyoruz. "Bu iş için doğru araç mı?" diye soruyoruz. AI da öyle.

AI'a "güvenmek" yanlış soru. Doğru soru: **"Bu görev için AI doğru araç mı?"**

Bazı görevlerde AI mükemmel. Bazılarında vasat. Bazılarında zararlı. Senior developer olmak, bu ayrımı yapabilmek demek.

---

## Günlük Workflow'umda AI'ın Yeri

Tipik bir iş günümde AI'ı şu şekilde kullanıyorum:

### Sabah — Planlama (AI: %20)

Günün task'larını gözden geçirirken AI'a nadiren danışırım. Planlama **bağlam** gerektirir — hangi feature'ın öncelikli olduğu, hangi teknik borcun tehlikeli olduğu, takım dinamikleri. Bunları AI bilmez.

Ama bazen büyük bir feature'ı alt task'lara bölerken AI'a sorarım:

```
"Bir mesajlaşma uygulamasına emoji özelliği ekliyorum.
DB schema'dan UI'a kadar hangi adımlarla ilerlemeliyim?"
```

AI'ın verdiği liste genellikle iyi bir **başlangıç noktası**. Ama o listeyi kendi bilgimle filtreliyorum — AI'ın bilmediği bağımlılıkları, edge case'leri, mevcut mimariyle uyumu ben ekliyorum.

### Öğle — Kodlama (AI: %50-60)

Burası AI'ın en çok parladığı alan. Ama dikkat: **%50-60 demek %100 değil**.

AI'ı kodlamada şöyle kullanıyorum:

**Yazdırıyorum:**
- Boilerplate kod (component scaffold, service skeleton)
- Birim testleri (test case üretimi)
- Tekrarlı pattern dönüşümleri
- CSS/SCSS implementasyonu (Figma'dan aldığım değerlerle)
- Utility fonksiyonları

**Yazdırmıyorum:**
- Mimari kararlar (hangi service nereye bağlanacak)
- State management akışları (karmaşık state geçişleri)
- Güvenlik kodu (auth, crypto, token handling)
- Performans optimizasyonu kararları (ne optimize edileceği)

### Öğleden sonra — Debug (AI: %30-40)

Debugging'de AI ilginç bir yardımcı. Hata mesajını yapıştırıp "bu ne?" diye sorunca genellikle doğru açıklama veriyor. Ama **çözüm** her zaman doğru olmuyor.

```
🧑 "TypeError: Cannot read properties of undefined (reading 'map')"
🤖 "Array undefined geliyor, API response'u kontrol edin..."
```

Bu seviyede AI hızlı. Ama gizli bug'larda — race condition, timing issue, state corruption — AI neredeyse hiç yardımcı olamıyor. Çünkü bu tür bug'lar **çalışma zamanı davranışına** bağlı ve AI kodu statik olarak okuyor.

### Akşam — Review & Refactor (AI: %40-50)

Kod review'da AI'ı ikinci bir göz olarak kullanıyorum:

```
"Bu dosyada potansiyel sorunlar, anti-pattern'ler veya güvenlik açıkları var mı?"
```

AI'ın yakaladıkları:
- Temizlenmemiş subscription'lar
- Unused import'lar
- Null check eksiklikleri
- Naming convention ihlalleri

AI'ın kaçırdıkları:
- Business logic hataları
- Mimariye uymayan tasarım kararları
- Performans darboğazları (profiling verisi olmadan)
- UX sorunları

---

## AI Güven Skalası

Yıllar içinde geliştirdiğim ve her gün kullandığım skalaya ben **"Renk Kuralı"** diyorum:

### 🟢 Yeşil — Gözü Kapalı Güven (%90+)

Bu kategorideki işlerde AI çıktısını neredeyse direkt kullanıyorum. Sadece hızlıca göz atıyorum.

- **Import path değişiklikleri** — `@old/path` → `@new/path`
- **Formatlama** — Prettier, ESLint fix
- **Basit refactor** — Değişken adı değişikliği, extract method
- **Boilerplate** — Component scaffold, interface tanımı
- **Regex yazma** — AI regex'te benden iyi
- **JSON/YAML oluşturma** — Yapılandırma dosyaları

### 🟡 Sarı — Güven Ama Doğrula (%60-90)

Bu kategoride AI'ın çıktısını kullanıyorum ama her satırı review ediyorum.

- **Component oluşturma** — Yapı doğru, detaylar eksik olabilir
- **CSS/SCSS yazma** — Genel layout doğru, pixel-level polish gerekir
- **Test generation** — Happy path iyi, edge case'ler eksik
- **API entegrasyonu** — Genel yapı doğru, error handling eksik
- **Dokümantasyon** — İçerik doğru, ton ve detay ayarlaması gerekir
- **Dependency araştırma** — "Hangi kütüphane?" sorusuna iyi cevap verir ama versiyon uyumu kontrol edilmeli

### 🟠 Turuncu — Referans Al, Kendin Yap (%30-60)

Bu kategoride AI'dan fikir alıyorum ama kodu ben yazıyorum.

- **Mimari tasarım** — "Bu feature'ı nasıl yapılandırmalıyım?" İyi fikirler verir ama projenin mevcut mimarisini bilmez
- **Performans optimizasyonu** — Genel prensipleri bilir ama profilin sonuçlarını yorumlayamaz
- **Karmaşık state yönetimi** — Basit flow'ları iyi çizer, multi-step async akışlarda kaybolur
- **Database schema** — Temel şemayı çizer ama indexing stratejisi, query pattern'i ve ölçeklendirme kararları insana ait
- **Hata yönetimi stratejisi** — Generic handler üretir, domain-specific error handling yapamaz

### 🔴 Kırmızı — AI'a Sorma Bile (%0-30)

Bu kategoride AI kullanmıyorum, ya da sadece "acaba böyle bir yaklaşım mantıklı mı?" seviyesinde danışıyorum. Kodu asla doğrudan almıyorum.

- **Güvenlik kodu** — Auth flow, token yönetimi, şifreleme
- **Kripto işlemleri** — HMAC, sertifika yönetimi, key rotation
- **Veri silme** — Geri dönüşü olmayan operasyonlar
- **Production konfigürasyonu** — Ortam değişkenleri, deploy ayarları
- **Hassas veri işleme** — PII, kullanıcı verileri, GDPR kapsamındaki operasyonlar
- **Ödeme entegrasyonu** — Finansal işlemler

---

## Junior vs. Senior: Aynı AI, Farklı Sonuç

AI okur-yazarlığı deneyim seviyesinden bağımsız bir beceri değil. Aynı AI aracını bir junior ve bir senior çok farklı kullanır. İşte gözlemlediğim farklar:

### Junior Developer AI Kullanımı

```
🧑 "Bir login sayfası yap"
🤖 [500 satır kod]
🧑 "Tamam, kullanayım"
```

**Problem:** Junior, AI'ın çıktısını değerlendirecek deneyime sahip değil. "Bu iyi mi, kötü mü?" sorusunu soramaz çünkü referans çerçevesi yok.

### Senior Developer AI Kullanımı

```
🧑 "Login form'un validation kısmını yaz. 
    Email formatı, min 8 karakter şifre, 
    form submit'te loading state.
    Error mesajları Türkçe olsun."
🤖 [150 satır odaklanmış kod]
🧑 [Review: "Password strength check eksik, 
    debounce eklemeli, error state'ini 
    düzelteyim..."]
```

**Fark:** Senior, ne istediğini biliyor, AI'ın çıktısını değerlendirebiliyor ve eksikleri tamamlayabiliyor.

### Kritik Fark: Soru Sorma Becerisi

Senior developer'ın AI avantajı **ne sorduğunu bilmesidir**. Kötü prompt → kötü sonuç. İyi prompt → iyi başlangıç noktası.

```
❌ "Memory leak'i düzelt"
✅ "Bu component'te shareReplay kullanımında refCount 
    belirtilmemiş ve subscription ngOnDestroy'da 
    temizlenmiyor. İkisini de düzelt."
```

İlk prompt'u bir junior yazabilir. İkincisini yazmak için **memory leak'in ne olduğunu, shareReplay'in nasıl çalıştığını ve Angular lifecycle hook'larını** bilmen gerekir.

**AI, bilgini güçlendirir. Bilmediğini büyütmez.**

---

## 5 Pratik Kural

Yıllar içinde oluşturduğum ve her gün uyguladığım kurallar:

### 1. "AI'ın yazdığı her satır senin sorumluluğundur"

Production'a giren kod AI yazmış olsa bile **senin** kodundur. Bug çıkarsa "AI yazdı" diyemezsin. Bu yüzden her satırı anlamadan commit'leme.

### 2. "Önce neyi istediğini bil, sonra AI'a sor"

AI'a "bir şeyler yap" dersen, bir şeyler yapar. Ama senin istediğin şeyi yapıp yapmadığını bilemezsin. Önce kafanda netleştir: ne istiyorum, hangi constraint'ler var, kabul kriterim ne?

### 3. "Context ver, context ver, context ver"

AI'ın en büyük zayıflığı context eksikliği. Ne kadar çok context verirsen o kadar iyi sonuç alırsın.

```
❌ "Bu dosyayı refactor et"
✅ "Bu dosya 800 satır. Chat component'inin 
    composer kısmını ayrı bir component'e çıkarmak 
    istiyorum. Mevcut input binding'lerini koru, 
    event emitter'lar ile parent'a ilet."
```

### 4. "Üç kere yanılırsa, kendin yap"

AI bazen bir sorunu çözemez ve her seferinde farklı ama yanlış cevaplar verir. Üçüncü denemeden sonra durup kendi çözümünü üretmek — hem daha hızlıdır hem de daha güvenilirdir.

### 5. "AI'ı öğrenmek için kullan, sadece üretmek için değil"

AI'ın en değerli kullanımı bir konuyu **açıklatmak**:

```
"Bu RxJS operatörlerinin farkı ne: switchMap vs mergeMap vs concatMap?
Her birini ne zaman kullanmalıyım? Gerçek senaryolarla açıkla."
```

Bu tür sorular seni **daha iyi developer** yapar. Sadece "şu kodu yaz" demek ise yeteneğini geliştirir mi orası tartışılır.

---

## Günlük AI Araçlarım

Her gün kullandığım araç kombinasyonu ve her biriyle ne yaptığım:

| Araç | Ne İçin Kullanıyorum | Ne İçin Kullanmıyorum |
|------|----------------------|----------------------|
| **Claude/Copilot** | Kod completion, inline refactor | Mimari karar, güvenlik kodu |
| **ChatGPT** | Kavram açıklama, strateji tartışma | "Benim için düşün" tarzı kullanım |
| **AI Code Review** | Pattern tespiti, anti-pattern | Business logic doğrulama |
| **AI Search** | Kütüphane karşılaştırma, API dokümantasyonu | Projeye özel best practice |

Önemli: Hiçbir aracı **tek başına** kullanmıyorum. Her zaman bir AI aracı + kendi bilgim + DevTools / test sonuçları üçlüsüyle çalışıyorum.

---

## AI Beni Daha İyi Developer mı Yaptı?

Dürüst cevap: **Hayır, ama daha hızlı yaptı.**

AI bana yeni bir beceri öğretmedi. Zaten bildiğim şeyleri daha hızlı yapmamı sağladı. Boilerplate yazarken harcadığım zamanı, mimari düşünmeye ayırabiliyorum. CSS hatalarıyla uğraşırken kaybettiğim zamanı, kullanıcı deneyimini iyileştirmeye harcıyorum.

Ama tehlike de burada: AI'a çok güvenirsen, **öğrenmeyi bırakırsın**. Bir RxJS operatörünün nasıl çalıştığını anlamadan kullanırsan, debug edemezsin. AI'ın yazdığı kodu okumadan commit'lersen, o kod senin değildir.

**Stratejim basit:** AI'ı hız için kullan, öğrenme için Google'a geri dön. AI'ın yazdığı kodu anla, sonra kullan.

---

## Sonuç: AI ile Çalışmanın 3 Seviyesi

Gözlemlediğim 3 seviye var:

**Seviye 1 — AI Korkusu:** "AI benim işimi elinden alacak." Bu yanlış. AI senin aracın, rakibin değil.

**Seviye 2 — AI Sarhoşluğu:** "AI her şeyi yapabilir, ben sadece prompt yazarım." Bu da yanlış. AI'ın ürettiği kodun sorumluluğu hâlâ sende.

**Seviye 3 — AI Pragmatizmi:** "AI bazı işlerde harika bir araç. Hangi işlerde olduğunu biliyorum." Buraya ulaşmak deneyim ister.

Senior developer olmanın avantajı: **Seviye 3'e daha hızlı ulaşırsın.** Çünkü neyin doğru, neyin yanlış olduğunu zaten biliyorsun.

AI programlamayı demokratikleştirdi — herkes kod üretebilir. Ama kaliteli, sürdürülebilir, güvenli yazılım üretmek hâlâ **mühendislik** becerisi.

Ve bu beceri, hiçbir prompt'la elde edilmiyor.

---

*AI kullanım stratejinizi paylaşmak isterseniz [LinkedIn](https://linkedin.com/in/umuttcakir) üzerinden yazabilirsiniz.*
