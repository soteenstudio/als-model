export function binaryConverter(text: string): string {
  const binary = text.split(' ').map(word => {
    return word.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  }).join(' ');
  
  return binary;
}