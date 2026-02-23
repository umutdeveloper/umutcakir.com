export const SITE = {
  title: 'Umut Çakır',
  description: 'Senior Software Engineer | AI-Augmented Engineering | Angular • TypeScript • Electron',
  url: 'https://umutcakir.com',
  author: 'Umut Çakır',
  email: 'umutcakirbm@gmail.com',
  phone: '+905467781677',
  linkedin: 'https://linkedin.com/in/umuttcakir',
  github: 'https://github.com/umutcakir',
} as const;

export const NAV_LINKS = [
  { label: 'Hakkımda', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projeler', href: '/projects' },
  { label: 'Eğitimler', href: '/egitimler' },
  { label: 'İletişim', href: '/contact' },
] as const;

export const SKILLS = [
  { name: 'Angular', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Electron', category: 'frontend' },
  { name: 'RxJS', category: 'frontend' },
  { name: 'NgXS', category: 'frontend' },
  { name: 'React', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'SCSS/CSS', category: 'frontend' },
  { name: 'HTML5', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express.js', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  { name: 'PouchDB', category: 'backend' },
  { name: 'gRPC', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },
  { name: 'WebRTC', category: 'infra' },
  { name: 'Docker', category: 'infra' },
  { name: 'GitLab CI', category: 'infra' },
  { name: 'AWS', category: 'infra' },
  { name: 'OpenID Connect', category: 'infra' },
  { name: 'Figma', category: 'design' },
  { name: 'Material Design', category: 'design' },
  { name: 'RTL/i18n', category: 'design' },
  { name: 'AI Pair Programming', category: 'ai' },
  { name: 'Prompt Engineering', category: 'ai' },
  { name: 'Agentic AI Patterns', category: 'ai' },
  { name: 'AI-Augmented Workflows', category: 'ai' },
] as const;

export const EXPERIENCES = [
  {
    company: 'RealTyme',
    role: 'Senior Software Engineer',
    period: 'Eyl 2022 – Halen',
    location: 'Cenevre, İsviçre',
    description: 'Güvenlik odaklı, E2E şifreli iletişim platformunu Electron + Angular ile geliştirme. Uçtan uca özellik teslimatı, Angular migration yönetimi ve performans mühendisliği.',
    highlights: ['Angular Migration', 'E2E Encryption', 'Offline-first', 'Performans'],
  },
  {
    company: 'Getir',
    role: 'Senior Frontend Developer',
    period: 'Kas 2021 – Ağu 2022',
    location: 'İstanbul, Türkiye',
    description: 'Franchise paneli üzerinde React, Redux ve Saga ile özellik geliştirme. Mid/junior geliştiricilere mentorluk ve teknik mülakat yönetimi.',
    highlights: ['React/Redux', 'Mentorluk', 'Teknik mülakat'],
  },
  {
    company: 'ADYOUNEED',
    role: 'Co-founder & Senior Lead Engineer',
    period: 'Nis 2019 – May 2021',
    location: 'İstanbul, Türkiye',
    description: 'Şirketi teknik kurucu olarak sıfırdan kurma. Angular + Node.js full-stack platform, Facebook/Google/LinkedIn Ads API entegrasyonu, Stripe ödeme ve AWS/Docker altyapısı.',
    highlights: ['Co-founder', 'Full-stack', '0→1 ürün', 'Stripe', 'AWS/Docker'],
  },
  {
    company: 'NETAŞ',
    role: 'Frontend Web Developer',
    period: 'Nis 2017 – Haz 2019',
    location: 'İstanbul, Türkiye',
    description: 'Low-code UI geliştirme aracında Angular.js → Angular migration ve performans iyileştirmeleri. Custom vanilla JS ve Angular bileşenleri geliştirme.',
    highlights: ['Angular.js → Angular', 'Performans', 'Low-code platform'],
  },
] as const;

export const TEACHINGS = [
  {
    title: 'AI ile Kendi Eğitimini Tasarla',
    platform: 'Yakında',
    period: '2026',
    description: 'Neyi öğrenmen gerektiğini tespit etmekten, kişiselleştirilmiş öğrenme planı oluşturmaya kadar AI destekli öğrenme stratejileri. Kendi eğitim müfredatını AI ile nasıl hazırlarsın?',
    topics: ['Öğrenme Yol Haritası', 'AI ile Müfredat', 'Bilgi Boşluğu Analizi', 'Kişiselleştirilmiş Plan', 'Pratik Odaklı Öğrenme'],
    resources: {},
  },
  {
    title: 'AI-Augmented Yazılım Geliştirme',
    platform: 'Yakında',
    period: '2026',
    description: 'AI araçlarını günlük geliştirme süreçlerine entegre ederek daha hızlı ve kaliteli kod üretme. Copilot, cursor rules, prompt engineering ve code review stratejileri.',
    topics: ['AI Pair Programming', 'Prompt Engineering', 'Code Review + AI', 'Debugging + AI', 'Mimari Kararlar'],
    resources: {},
  },
  {
    title: 'AI ile Verimlilik & Hız',
    platform: 'Yakında',
    period: '2026',
    description: 'Teknik dokümantasyon, test yazımı, refactoring ve planlama gibi süreçlerde AI ile 10x verimlilik. Neleri AI\'a bırakmalı, neleri kendin yapmalısın?',
    topics: ['Otomasyon Stratejisi', 'AI + Test', 'AI + Dokümantasyon', 'Refactoring', 'Karar Çerçevesi'],
    resources: {},
  },
] as const;

export const PAST_TEACHINGS = [
  {
    title: 'Temel Angular Eğitimi',
    platform: 'Çevrimiçi Eğitim Platformu',
    period: 'Nisan 2023',
    description: 'Angular framework\'ünün temellerini kapsayan kapsamlı eğitim programı.',
    resources: {
      slides: '/egitimler/temel-angular-egitimi.pdf',
      assignment: '/egitimler/angular-odevi.pdf',
    },
  },
  {
    title: 'Temel SQL Eğitimi',
    platform: 'Çevrimiçi Eğitim Platformu',
    period: 'Şubat 2023',
    description: 'SQL sorgulama dilinin temellerinden ileri seviye konularına kadar uygulamalı eğitim.',
    resources: {
      slides: '/egitimler/temel-sql-egitimi.pdf',
      assignment: '/egitimler/sql-odevi.pdf',
    },
  },
  {
    title: 'Temel Git Eğitimi',
    platform: 'Çevrimiçi Eğitim Platformu',
    period: 'Şubat 2023',
    description: 'Git versiyon kontrol sisteminin temellerini öğreten uygulamalı eğitim.',
    resources: {
      slides: '/egitimler/temel-git-egitimi.pdf',
    },
  },
] as const;
