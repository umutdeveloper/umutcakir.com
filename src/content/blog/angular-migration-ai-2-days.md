---
title: "Angular 15→21 Migration'ı AI ile 2 Günde Nasıl Bitirdim?"
description: "6 major Angular version geçişini AI destekli workflow ile 2 günde tamamladım. Nerede 10x hız kazandım, nerede AI'a güvenmemem gerektiğini öğrendim."
pubDate: 2026-02-24
heroImage: /assets/angular-migration.png
tags: ["angular", "ai", "migration", "cursor", "frontend", "productivity"]
lang: "tr"
---

## Hikaye

6 major Angular version geçişini (**15 → 21**) AI destekli workflow ile **2 günde** tamamladım. Bu migration'ı daha önce AI olmadan planlasam, en az **1.5–2 hafta** ayırırdım. 

Bu yazıda ne süslü bir "AI harika" hikayesi, ne de "AI işe yaramıyor" şikayeti okuyacaksınız. Gerçek bir production deneyiminden çıkan **dürüst bir rapor**.

---

## Migration'ın Boyutu

Tam olarak ne yaptığımı netleştireyim:

```
Angular 15 → 16 → 17 → 18 → 19 → 20 → 21
```

- **6 major Angular version** upgrade
- **Angular Material Legacy → MDC** tam geçiş (Button, Dialog, Checkbox, Form field, Slider, Select, Tabs, Tooltip, Table, Snackbar, Progress bar, Menu, List, Radio, Spinner)
- **100+ kütüphane** güncelleme
- **Prettier v3** codebase-wide format
- `toPromise()` → `firstValueFrom` / `lastValueFrom` dönüşümü
- Patch dosyaları yönetimi (@types/node gibi)

---

## Günlük

### Gün 1: Versiyon Geçişleri + Breaking Change'ler

**Sabah — ng update zinciri (~3 saat)**

Her version geçişi için döngüm şuydu:

1. `ng update` çalıştır
2. Hata çıktısını **olduğu gibi** AI'a yapıştır
3. AI'ın önerdiği fix'leri uygula
4. Build al → yeni hataları tekrar AI'a ver
5. Yeşil build → sonraki version'a geç

```
🧑 "ng update @angular/core@16 sonrası bu hatalar çıktı: [hata listesi]"
🤖 "Bu hatalar şu breaking change'lerden kaynaklanıyor: [açıklama + çözümler]"
```

**Bu adımda AI'ın faydası: 🟢 Çok Yüksek**

Angular'ın her version için resmi migration rehberi var. AI bu rehberleri biliyor ve hata mesajlarını doğrudan ilgili breaking change'e eşliyor. Eskiden her version için migration guide'ı manuel okuyup, kendi kodumda karşılığını buluyordum. AI bu mapping'i saniyeler içinde yapıyor.

**Öğle — Deprecated API temizliği (~2 saat)**

`toPromise()` → `firstValueFrom` dönüşümü tam olarak AI'ın parladığı yer:

```typescript
// ❌ Eski — deprecated
const result = await this.store.select(MyState.data).pipe(take(1)).toPromise();

// ✅ Yeni — AI'ın önerisi
const result = await firstValueFrom(this.store.select(MyState.data));
```

Bu dönüşüm mekanik. Pattern belli, risk düşük. AI'a dosya verip "tüm `toPromise()` kullanımlarını `firstValueFrom` ile değiştir" dediğimde, import'ları bile düzgün ekledi.

**Bu adımda AI'ın faydası: 🟢 Çok Yüksek**

Mekanik, pattern-based dönüşümlerde AI neredeyse %100 doğru çalışıyor. `uuid/v4` → `uuid.v4` gibi import path değişiklikleri de aynı kategoride.

---

### Gün 2: Material MDC + Son Dokunuşlar

**Sabah — Angular Material Legacy → MDC (~4 saat)**

İşte burada AI'ın sınırları gerçekten ortaya çıktı.

Angular Material 15+ ile tüm component'ler MDC (Material Design Components) altyapısına geçti. Bu sadece import path değişikliği değil — **bileşenlerin DOM yapısı, CSS class isimleri ve görsel davranışları** tamamen değişti.

AI'a sordum:

```
🧑 "mat-form-field legacy'den MDC'ye geçerken SCSS'te ne değişmeli?"
🤖 "::ng-deep .mat-form-field-wrapper yerine ::ng-deep .mdc-text-field kullanın..."
```

Teorik olarak doğru. Ama pratikte? **Her component'in kendi projemdeki özel stilini** AI bilmiyor. Figma'daki tasarıma uygun mu bilmiyor. Dark mode'da nasıl görünüyor bilmiyor.

Bu adımı şöyle yönettim:

1. AI'a component listesini verdim → genel MDC migration mapping'i aldım
2. Bu mapping'i referans alarak her component'i **tek tek** gözle kontrol ettim
3. SCSS düzeltmelerinin %40'ını AI yaptı, %60'ını ben elle yaptım

**Bu adımda AI'ın faydası: 🟠 Orta**

MDC migration'ın teknik kısmını (import, class name) AI iyi biliyor. Ama **görsel uyumu** insan gözü olmadan doğrulamak imkansız. Figma'dan bakıp "bu buton 2px sağa kaymış" demek hâlâ insanın işi.

**Öğleden sonra — Dependency güncellemeleri + Build fix (~3 saat)**

100+ kütüphane güncellemesi sırasında AI'ı vulnerability çözümlemesinde kullandım:

```
🧑 "Bu package.json'daki outdated dependency'leri Angular 21 ile uyumlu versiyonlara güncelle"
🤖 [uyumluluk matrisi + öneriler]
```

Patch dosyalarını güncelleme konusunda AI çok yardımcı oldu — bunlar projemize özel fork'lar ve AI bu context'i biliyor, orijinal paket ile karşılaştırarak yeni patch dosyalarını anında üretiyor.

**Bu adımda AI'ın faydası: 🟡 Orta-Yüksek** (genel dependency'ler için), **🟢 Çok Yüksek** (custom patch'ler için)

**Akşam — Son build, lint ve formatlama (~1 saat)**

Prettier v3 formatting'i tüm codebase'e uyguladım. Kalan lint hatalarını AI'a verdim, toplu fix aldım. Final build yeşil.

**Bu adımda AI'ın faydası: 🟢 Çok Yüksek**

---

## Zaman Karşılaştırması

| Adım | AI Olmadan (Tahmin) | AI ile (Gerçek) | Kazanım |
|------|---------------------|-----------------|---------|
| ng update zinciri (6 version) | 1.5 gün | 3 saat | ~4x |
| Deprecated API dönüşümü | 1 gün | 2 saat | ~4x |
| Material MDC migration | 3–4 gün | 4 saat | ~6x* |
| Dependency güncellemeleri | 1 gün | 3 saat | ~2.5x |
| Lint, format, son düzeltmeler | 0.5 gün | 1 saat | ~4x |
| **Toplam** | **7–8.5 gün** | **~13 saat** | **~3.5-4x** |

*\*MDC migration'da 6x hız kazanımı var ama AI'ın yaptığı işin %60'ını gözle kontrol ettim. "Net" kazanım daha düşük.*

---

## AI Nerede Parlıyor?

### 1. Hata mesajı → Çözüm eşleştirme
Angular CLI'ın verdiği hata mesajlarını AI'a yapıştırınca, hangi breaking change'den kaynaklandığını ve çözümünü anında veriyor. Eskiden Stack Overflow + migration guide arasında gidip geliyordum.

### 2. Mekanik, pattern-based refactor
`toPromise()` → `firstValueFrom` ve import path değişiklikleri gibi basit dönüşümler. AI bunları dosya bazında hatasız yapıyor.

### 3. Dependency uyumluluk kontrolü
"Bu kütüphanenin Angular 21 ile uyumlu versiyonu ne?" sorusuna genellikle doğru cevap veriyor.

### 4. Boilerplate ve tekrarlı kod
Yeni pattern'e geçiş sırasında import ekleme, constructor düzenleme gibi tekrarlı işlerde çok hızlı.

---

## AI Nerede Başarısız?

### 1. Görsel doğrulama
MDC migration'dan sonra "bu ekran doğru görünüyor mu?" sorusuna AI cevap veremez. Figma'dan bakıp karşılaştırma insanın işi.

### 2. Proje-özel context
Company-specific konfigürasyonlar, internal library'ler — AI bunları bilemez. Ne kadar context verirsen ver, 3.5 yıllık projenin tüm geçmişini AI'a yükleyemezsin.

### 3. Cascading side effect'ler
Bir component'te yapılan değişikliğin başka bir yerde nasıl bir yan etki yaratacağını AI her zaman göremez. Global styling değişiklikleri veya shared service güncellemeleri özellikle bu kategoriye girerken, AI çoğunlukla sadece doğrudan etkilenen dosyayı görmüş olur.

### 4. Build hataları zinciri
Bazen bir fix yapınca 3 yeni hata çıkar. AI her birini bağımsız çözer ama bunların **birbirleriyle ilişkisini** her zaman kuramaz.

---

## Benim AI Workflow'um

Migration boyunca geliştirdiğim pratik workflow:

### Adım 1: Hatayı olduğu gibi ver
```
[Terminal çıktısını kopyala-yapıştır]
"Bu Angular 17→18 geçişinde çıkan hatalar. Her birini açıkla ve fix öner."
```

### Adım 2: Toplu refactor iste
```
"Bu dosyadaki tüm @Select decorator kullanımlarını inject(Store).select() pattern'ine çevir.
Mevcut import'ları güncelle, gereksizleri kaldır."
```

### Adım 3: Context ver
```
"Bu projede Angular Material bileşenleri white-label theming ile kullanılıyor.
Custom color token'lar var. MDC migration'dan sonra bu SCSS dosyasını güncelle."
```

### Adım 4: Review et, build al, tekrarla
Her AI çıktısını uygula → build al → yeni hata varsa → tekrar AI'a ver. Bu döngü çok hızlı.

---

## AI Güven Skalası — Migration Özelinde

Bu migration'dan çıkardığım güven tablosu:

| İş Tipi | AI Güven | Açıklama |
|---------|----------|----------|
| Import path değişiklikleri | 🟢 %95+ | Neredeyse hiç hata yok |
| API signature dönüşümleri | 🟢 %90+ | toPromise → firstValueFrom vb. |
| Dependency versiyon tespiti | 🟡 %70-85 | Çoğunlukla doğru, bazen eski bilgi |
| SCSS class name migration | 🟡 %60-80 | Mapping doğru, context eksik |
| Görsel uyum kontrolü | 🔴 %15-20 | AI 1:1 yapamaz, insan şart |

---

## Öğrendiğim 5 Şey

**1. AI seni 4-5x hızlandırır — ve bu da muazzam.**
2 haftalık işi 2 güne sıkıştırmak küçümsenecek bir şey değil. Ama "AI her şeyi yaptı" demek yalan olur.

**2. Mekanik iş = AI'ın alanı, yargı gerektiren iş = insanın alanı.**
Pattern dönüşümleri AI'a ver. "Bu component bu Figma'ya uyuyor mu?" sorusunu kendine sor.

**3. Context kraldır.**
AI'a ne kadar çok proje context'i verirsen, o kadar iyi sonuç alırsın. Ama bir noktadan sonra context vermenin getirisi azalıyor. 10 yıllık bir projenin tüm bilgisini veremezsin.

**4. Build-fix döngüsü AI ile çok hızlı.**
Hata → AI'a ver → fix al → uygula → build → tekrarla. Bu döngünün her turu eskiden 15-20 dakika sürerdi, AI ile 2-3 dakikaya indi.

**5. Migration sonrası test hâlâ insanın sorumluluğu.**
AI build'i yeşile getirir ama "uygulama doğru çalışıyor mu?" sorusu hâlâ senin. Her ekranı açıp, her akışı test edip, Figma ile karşılaştırmak zorundasın.

---

*Sorularınız veya kendi migration deneyimleriniz varsa [LinkedIn](https://linkedin.com/in/umuttcakir) üzerinden paylaşabilirsiniz.*
