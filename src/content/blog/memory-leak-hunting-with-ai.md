---
title: "Memory Leak Avında AI Ne Kadar İşe Yarıyor?"
description: "Production uygulamalarda memory leak bulmak zanaattır. AI bu zanaatta usta mı, çırak mı? Gerçek senaryolarla test ettim."
pubDate: 2026-02-22
tags: ["performance", "ai", "memory-leak", "rxjs", "javascript", "debugging"]
lang: "tr"
---

## Giriş

Bir cuma akşamı, kullanıcılardan "uygulama 2 saat sonra donuyor" şikayeti geldi. Klasik memory leak belirtisi. Heap snapshot aldım, 800MB. Normal çalışmada 120MB olması gereken uygulama, zamanla şişiyordu.

Bu yazı o cuma akşamı başlayan avın hikayesi değil. Bu yazı, o avı **AI ile birlikte yapma** deneyimimin dürüst raporu. Memory leak bulmak zor iştir — AI bunu kolaylaştırıyor mu, yoksa sadece yüzeysel önerilerle zaman mı kaybettiriyor?

5 gerçek memory leak senaryosunu AI'a verdim. Her birinde:
- AI ne buldu, ne kaçırdı?
- AI olmadan ne kadar sürerdi?
- AI'a ne kadar güvenebilirim?

---

## Memory Leak Neden Zor?

Memory leak'ler normal bug'lardan farklıdır. Uygulama **crash etmez**, hata **fırlatmaz**, console'a **bir şey yazmaz**. Sadece yavaş yavaş şişer. Bazen saatlerce, bazen günlerce fark edilmez.

Leak bulmak için 3 şey gerekir:

1. **Semptom tespiti** — Kullanıcı ne zaman, hangi aksiyonla sorunu tetikliyor?
2. **İzolasyon** — Hangi component, servis veya akış sızıntı yapıyor?
3. **Kök neden** — Neden temizlenmiyor? Referans nerede tutuluyor?

AI bu üç adımdan hangilerinde yardımcı olabilir? Gerçek senaryolarla bakalım.

---

## Senaryo 1: RxJS `shareReplay` Tuzağı

**Problem:** Bir dashboard ekranında widget'lar observable stream'leri paylaşıyordu. Kullanıcı ekranlar arası geçiş yaptıkça bellek artıyordu.

**Kodu AI'a verdim:**

```typescript
// Dashboard widget service
getData() {
  return this.http.get('/api/stats').pipe(
    shareReplay(1)
  );
}
```

**AI'ın yanıtı:**

> "shareReplay(1) kullanırken refCount belirtilmemiş. Tüm subscriber'lar unsubscribe olsa bile observable hafızada kalır. `shareReplay({ bufferSize: 1, refCount: true })` kullanmalısınız."

```typescript
// ✅ AI'ın önerdiği fix
getData() {
  return this.http.get('/api/stats').pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
```

**Sonuç: 🟢 AI Doğru Buldu**

Bu klasik bir RxJS leak pattern'i ve AI bunu mükemmel tespit etti. Açıklama da doğruydu — `refCount: true` olmadan source observable reference'ı yaşamaya devam ediyor.

**Ama bir not:** Bu pattern Google'da "rxjs memory leak" yazınca ilk çıkan sonuç. AI'ın burada yaptığı, iyi bilinen bir pattern'i tanımak. Gerçek soru şu: **peki ya pattern tanınmıyorsa?**

---

## Senaryo 2: Blob URL Birikimi

**Problem:** Bir mesajlaşma uygulamasında ses dosyaları oynatılıyordu. Her oynatmada yeni Blob URL oluşturuluyordu ama hiçbiri temizlenmiyordu.

**Kodu AI'a verdim:**

```typescript
async playAudio(fileId: string) {
  const blob = await this.fileService.download(fileId);
  const url = URL.createObjectURL(blob);
  this.audioElement.src = url;
  this.audioElement.play();
}
```

**AI'ın yanıtı:**

> "`URL.createObjectURL` ile oluşturulan URL'ler garbage collect edilmez. Her çağrıda yeni bir Blob URL oluşturuluyor ama hiçbiri `URL.revokeObjectURL` ile serbest bırakılmıyor."

```typescript
// ✅ AI'ın önerdiği fix
private currentBlobUrl: string | null = null;

async playAudio(fileId: string) {
  // Önceki URL'i temizle
  if (this.currentBlobUrl) {
    URL.revokeObjectURL(this.currentBlobUrl);
  }
  
  const blob = await this.fileService.download(fileId);
  this.currentBlobUrl = URL.createObjectURL(blob);
  this.audioElement.src = this.currentBlobUrl;
  this.audioElement.play();
}
```

**Sonuç: 🟢 AI Doğru Buldu**

Yine bilinen bir pattern. AI'ın önerisi doğru ve eksiksiz. `revokeObjectURL` çağrısını hem normal akışta hem de component destroy'da yapması gerektiğini de belirtti.

**Puan: 2/2.** Ama henüz kolay seviyedeyiz.

---

## Senaryo 3: Event Listener Sızıntısı — İşler Zorlaşıyor

**Problem:** Bir dosya sürükle-bırak özelliği vardı. Kullanıcı modal'ı açıp kapattıkça, `dragover` ve `drop` event listener'ları birikiyordu.

**Kodu AI'a verdim:**

```typescript
@Component({ ... })
export class FileDropZoneComponent implements OnInit {
  
  ngOnInit() {
    document.addEventListener('dragover', this.onDragOver);
    document.addEventListener('drop', this.onDrop);
  }

  onDragOver = (e: DragEvent) => {
    e.preventDefault();
    this.showDropIndicator();
  };

  onDrop = (e: DragEvent) => {
    e.preventDefault();
    this.handleFiles(e.dataTransfer?.files);
  };
}
```

**AI'ın yanıtı:**

> "ngOnDestroy hook'u eksik. Component destroy olduğunda event listener'lar kaldırılmıyor."

```typescript
// ✅ AI'ın önerdiği fix
export class FileDropZoneComponent implements OnInit, OnDestroy {
  
  ngOnInit() {
    document.addEventListener('dragover', this.onDragOver);
    document.addEventListener('drop', this.onDrop);
  }

  ngOnDestroy() {
    document.removeEventListener('dragover', this.onDragOver);
    document.removeEventListener('drop', this.onDrop);
  }
  // ...
}
```

**Sonuç: 🟡 Kısmen Doğru**

Fix doğru ama AI **asıl problemi kaçırdı**: bu component bir modal içinde kullanılıyordu ve modal her açılıp kapandığında yeni instance oluşuyordu. `ngOnDestroy` fix'i doğru ama bu bilgiyi ben vermeden AI'ın bunu bulması mümkün değildi — çünkü sadece tek bir dosyayı gördü.

**Gerçek leak:** Modal service'in component reference'ını tutması ve GC'nin çalışamamasıydı. AI bunu göremedi çünkü **context sınırlıydı**.

---

## Senaryo 4: Subscription Yığılması — Race Condition

**Problem:** Bir arama kutusu vardı. Kullanıcı her harf girdiğinde yeni bir API çağrısı yapılıyordu. Ama önceki subscription'lar cancel edilmiyordu.

**Kodu AI'a verdim:**

```typescript
export class SearchComponent implements OnInit {
  private searchResults: any[] = [];

  ngOnInit() {
    this.searchInput.valueChanges.subscribe(term => {
      this.apiService.search(term).subscribe(results => {
        this.searchResults = results;
      });
    });
  }
}
```

**AI'ın yanıtı:**

> "İç içe subscription var, bu bir anti-pattern. `switchMap` kullanmalısınız. Ayrıca dış subscription'ın da temizlenmesi gerekiyor."

```typescript
// ✅ AI'ın önerdiği fix
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.apiService.search(term)),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Sonuç: 🟢 AI Mükemmel**

AI sadece leak'i bulmadı, aynı zamanda `debounceTime` ve `distinctUntilChanged` gibi best practice'leri de ekledi. Bu tür RxJS pattern dönüşümleri AI'ın en güçlü olduğu alan.

**Ama kritik bir detay:** Gerçek production'da bu component farklı route'lardan farklı context'lerle açılabiliyordu. `switchMap`'in cancel davranışı bazı durumlarda istemediğimiz sonuçlar üretebilirdi — mesela uzun süren aramalarda kullanıcı sonuçsuz kalıyordu. Bu tür **business logic** kararlarını AI bilmiyor.

---

## Senaryo 5: Virtual Scroll + Async Data — AI'ın Kör Noktası

**Problem:** Bir feed listesinde virtual scroll kullanılıyordu. Kullanıcı aşağı scroll ettikçe yeni veriler yükleniyor, ama eski veriler bellekten temizlenmiyordu. Sayfa 20 dakika açık kalınca 500MB'ı geçiyordu.

**Kodu AI'a verdim** (basitleştirilmiş hali):

```typescript
export class FeedListComponent {
  private loadedItems: Map<string, FeedItem> = new Map();
  private subscriptions: Subscription[] = [];

  loadMore(page: number) {
    const sub = this.feedService.getPage(page).subscribe(items => {
      items.forEach(item => {
        this.loadedItems.set(item.id, item);
        if (item.hasMedia) {
          this.preloadMedia(item);
        }
      });
    });
    this.subscriptions.push(sub);
  }

  private preloadMedia(item: FeedItem) {
    const img = new Image();
    img.src = item.mediaUrl;
    item._preloadedImage = img;
  }
}
```

**AI'ın yanıtı:**

> "Subscription'lar `subscriptions` array'ine ekleniyor ama hiçbir zaman unsubscribe edilmiyor. `ngOnDestroy`'da hepsini temizlemelisiniz."

**Sonuç: 🔴 Yüzeysel Cevap — Asıl Problemi Kaçırdı**

AI'ın önerisi teknik olarak yanlış değil — subscription'ları temizlemek gerekiyor. Ama **gerçek problem çok daha derin**:

1. `loadedItems` Map'i sürekli büyüyor, hiçbir zaman eski item'lar çıkarılmıyor
2. `preloadMedia` ile oluşturulan Image nesneleri DOM'a eklenmese bile bellekte kalıyor
3. Bu Image nesneleri item'a referans olarak bağlı (`item._preloadedImage`), bu da GC'yi engelliyor
4. Map → Item → Image → decode edilmiş pixel data zinciri bellekte megabyte'larca yer tutuyor

Gerçek fix çok daha kapsamlıydı:

```typescript
// Gerçek çözüm — Windowed data management
private readonly BUFFER_SIZE = 100; // Bellekte max 100 item tut

loadMore(page: number) {
  this.feedService.getPage(page).pipe(
    takeUntil(this.destroy$)
  ).subscribe(items => {
    items.forEach(item => this.loadedItems.set(item.id, item));
    this.evictOldItems();
  });
}

private evictOldItems() {
  if (this.loadedItems.size > this.BUFFER_SIZE) {
    const keysToRemove = [...this.loadedItems.keys()]
      .slice(0, this.loadedItems.size - this.BUFFER_SIZE);
    
    for (const key of keysToRemove) {
      const item = this.loadedItems.get(key);
      if (item?._preloadedImage) {
        item._preloadedImage.src = ''; // Decode edilmiş pixel data'yı serbest bırak
        item._preloadedImage = null;
      }
      this.loadedItems.delete(key);
    }
  }
}
```

**AI neden kaçırdı?** Çünkü bu leak pattern'i **birden fazla katmanın etkileşiminden** kaynaklanıyordu. AI tek bir dosyaya bakıyor ve "subscription temizlenmemiş" gibi yüzeysel pattern'leri buluyor. Ama "Map sürekli büyüyor + Image nesneleri GC'yi engelliyor + pixel data decode ediliyor" zincirini **bağlam olmadan** kuramıyor.

---

## Skorboard

| Senaryo | Zorluk | AI Buldu mu? | Açıklama |
|---------|--------|-------------|----------|
| shareReplay refCount | Kolay | 🟢 Evet | Bilinen pattern, mükemmel tespit |
| Blob URL revoke | Kolay | 🟢 Evet | Bilinen pattern, eksiksiz fix |
| Event listener + modal | Orta | 🟡 Kısmen | Dosya-seviye fix doğru, cross-component leak kaçtı |
| Nested subscription | Orta | 🟢 Evet | Best practice'lerle birlikte güçlü cevap |
| Virtual scroll + Image | Zor | 🔴 Yüzeysel | Subscription fix'i verdi, asıl veri yönetimi sorununu kaçırdı |

**Genel skor: 3/5 tam, 1 kısmi, 1 başarısız**

---

## AI Memory Leak Avında Nerede İşe Yarıyor?

### 1. Bilinen pattern'leri anında tespit
`shareReplay`, `Blob URL`, `addEventListener` gibi klasik leak pattern'lerini AI saniyeler içinde buluyor. Bu pattern'leri ezberlemenize gerek kalmıyor.

### 2. RxJS operator önerileri
Nested subscription → `switchMap` + `takeUntil` dönüşümü gibi reactive programming pattern'lerini mükemmel biliyor.

### 3. Cleanup checklist oluşturma
"Bu component'te temizlenmesi gereken kaynaklar neler?" diye sorduğunuzda kapsamlı bir liste veriyor: subscription, event listener, timer, Blob URL, WebSocket...

### 4. Kod açıklama
Başkasının yazdığı kodu anlamaya çalışırken AI'ın "bu satır şunu yapıyor, ve şu referansı tuttuğu için GC çalışamıyor" açıklaması çok değerli.

---

## AI Memory Leak Avında Nerede Başarısız?

### 1. Multi-layer leak'ler
Birden fazla dosyanın, servisin veya katmanın etkileşiminden kaynaklanan leak'leri göremez. Sadece verdiğiniz dosyadaki pattern'leri kontrol eder.

### 2. Runtime davranış analizi
"Kullanıcı 50 kez bu ekranı açıp kapattığında ne oluyor?" sorusunu AI cevaplayamaz. Chrome DevTools'ta heap snapshot karşılaştırması yapan hâlâ insandır.

### 3. Data structure büyümesi
Map, Set, Array gibi koleksiyonların zaman içinde büyümesini "leak" olarak tanımlamaz — çünkü teknik olarak bunlar referansı tutulan verilerdir. Ama pratikte belleği şişiren en yaygın neden budur.

### 4. Dolaylı referanslar
Closure'lar, circular reference'lar ve WeakRef gerektiren senaryoları çoğunlukla kaçırır.

---

## Benim AI Workflow'um — Memory Leak Avı

Bu deneyimlerden sonra geliştirdiğim pratik workflow:

### Adım 1: Semptom tespiti (İnsan)
DevTools → Performance Monitor → JS Heap Size izle. Bellek sürekli artıyorsa leak var.

### Adım 2: İzolasyon (İnsan)
Heap snapshot karşılaştırması yap. Hangi nesneler birikmiş? Detached DOM node var mı?

### Adım 3: Şüpheli kodu AI'a ver
```
"Bu component'te memory leak olabilir mi? 
Özellikle subscription yönetimi, event listener temizliği 
ve object referanslarını kontrol et."
```

### Adım 4: AI'ın önerilerini filtrele (İnsan)
AI'ın yüzeysel önerilerini (subscription cleanup) hemen uygula. Ama asıl problemi bulmak için DevTools'a geri dön.

### Adım 5: Fix'i AI ile yaz, test'i kendin yap
Fix kodunu AI'a yazdır — genellikle iyi sonuç veriyor. Ama fix'in gerçekten işe yaradığını doğrulamak için heap snapshot'ı tekrar al.

---

## AI Güven Skalası — Memory Leak Özelinde

| Leak Tipi | AI Güven | Tavsiye |
|-----------|----------|---------|
| Subscription temizliği | 🟢 %90+ | AI'a güven, hemen uygula |
| Blob URL / ObjectURL | 🟢 %90+ | AI'a güven, hemen uygula |
| Event listener cleanup | 🟡 %70-85 | Dosya seviyesinde doğru, cross-component kontrol et |
| Timer / Interval temizliği | 🟢 %90+ | setInterval, setTimeout — AI iyi bilir |
| RxJS operator seçimi | 🟢 %85-95 | switchMap vs mergeMap kararını iyi verir |
| Data structure büyümesi | 🔴 %15-25 | AI genellikle fark etmez, sen izle |
| Circular reference | 🔴 %20-30 | AI yüzeysel bakar, WeakRef ihtiyacını kaçırır |
| Multi-service leak chain | 🔴 %10-20 | AI tek dosya görür, zinciri kuramaz |

---

## Sonuç: AI Çırak mı, Usta mı?

**AI iyi bir çırak.** Bilinen pattern'leri hızla buluyor, temizlik checklist'i çıkarıyor, fix kodu yazıyor. Ama bir çırağa yapacağın gibi — **işinin arkasından geçmen gerekiyor**.

Gerçek memory leak avı hâlâ şu döngüdür:

```
DevTools → Heap Snapshot → Şüpheli Kod → Analiz → Fix → Doğrula
```

AI bu döngünün "Analiz" ve "Fix" adımlarını hızlandırıyor. Ama "DevTools", "Heap Snapshot" ve "Doğrula" adımları hâlâ **senin beynini ve gözünü** gerektiriyor.

Memory leak avında AI'a **%40 iş yaptırabilirsin**. Kalan **%60** hâlâ senin zanaat bilgin.

Ve bu %40 bile — özellikle bilinen pattern'lerde — saatlerce sürecek aramayı dakikalara indirebiliyor. Yani: **kullan, ama güvenme. Doğrula.**

---

*Memory leak deneyimlerinizi paylaşmak isterseniz [LinkedIn](https://linkedin.com/in/umuttcakir) üzerinden yazabilirsiniz.*
