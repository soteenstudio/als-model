export function normalizedText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, '');
}