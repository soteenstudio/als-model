export function computeSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = [...setA].filter(word => setB.has(word)).length;
  return intersection / Math.max(tokensA.length, tokensB.length);
}