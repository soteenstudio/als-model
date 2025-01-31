function textToASCII(text: string, maxLength: number): number[] {
  const encoded: number[] = Array(maxLength).fill(0);
  for (let i = 0; i < text.length && i < maxLength; i++) {
    encoded[i] = text.charCodeAt(i) / 255;
  }
  return encoded;
}

interface Network {
  activate: (input: number[]) => number[];
}

interface EncodedTextData {
  text: string;
  maxTextLength: number;
  network: Network;
}

export function encodedText(data: EncodedTextData): number {
  const encoded = textToASCII(data.text, data.maxTextLength);
  const network = data.network;
  const prediction = network.activate(encoded);
  return prediction[0] > 0.5 ? 1 : 0;
}