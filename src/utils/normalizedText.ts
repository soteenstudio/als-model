export function normalizedText(text: string): any {
  return text.toLowerCase().replace(/[^\w\s]/g, '');
}