export function formatDate(date: Date, lang: string = 'tr'): string {
  return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
