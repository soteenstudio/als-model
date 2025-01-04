export function coOccurrence(dataset) {
  const wordCounts = {};
  const coOccurrences = {};

  dataset.forEach(item => {
    const words = item.input.split(' ');

    words.forEach(word => {
      if (wordCounts[word]) {
        wordCounts[word]++;
      } else {
        wordCounts[word] = 1;
      }

      words.forEach(coWord => {
        if (word !== coWord) {
          const pair = [word, coWord].sort().join(' ');
          coOccurrences[pair] = coOccurrences[pair] ? coOccurrences[pair] + 1 : 1;
        }
      });
    });
  });
  
  return {
    wordCounts,
    coOccurrences
  }
}