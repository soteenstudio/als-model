function textToASCII(text, maxLength) {
  const encoded = Array(maxLength).fill(0);
  for (let i = 0; i < text.length && i < maxLength; i++) {
    encoded[i] = text.charCodeAt(i) / 255;
  }
  return encoded;
}

export function encodedText(data) {
  const encoded = textToASCII(data.text, data.maxTextLength);
  const network = data.network
  const prediction = network.activate(encoded);
  return prediction[0] > 0.5 ? 1 : 0;
}