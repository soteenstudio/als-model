export function computeSimilarity(tokensA: string[], tokensB: string[]): number {
  var setA = new Set(tokensA);
  var setB = new Set(tokensB);

  // ES5-compatible way to get intersection size
  var intersection = 0;
  setA.forEach(function(word) {
    if (setB.has(word)) {
      intersection++;
    }
  });

  return intersection / Math.max(tokensA.length, tokensB.length);
}