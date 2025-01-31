interface CoOccurrenceResult {
  wordCounts: { [word: string]: number };
  coOccurrences: { [pair: string]: number };
}

export function coOccurrence(dataset: { input: string }[]): CoOccurrenceResult {
  const wordCounts: { [word: string]: number } = {};
  const coOccurrences: { [pair: string]: number } = {};

  dataset.forEach(item => {
    const words = item.input.split(' ');

    words.forEach(word => {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;

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
  };
}