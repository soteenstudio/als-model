export function tfidf(dataset, data) {
  const wordCounts = data.wordCounts
  const coOccurrences = data.coOccurrences;
  const newDataset = [];
  
  const totalWords = Object.keys(wordCounts).length;
  const wordWeights = {};

  for (const word in wordCounts) {
    wordWeights[word] = wordCounts[word] / totalWords;
  }

  const totalDocuments = dataset.length;
  const wordIdfs = {};

  for (const word in wordCounts) {
    let docCount = 0;

    dataset.forEach(item => {
      if (item.input.includes(word)) {
        docCount++;
      }
    });

    wordIdfs[word] = Math.log(totalDocuments / (docCount + 1));
  }

  const tfIdfWeights = {};
  for (const word in wordWeights) {
    tfIdfWeights[word] = wordWeights[word] * wordIdfs[word];
  }

  dataset = dataset.map(item => {
    const inputWords = item.input.split(' ');
    let weightedInput = 0;
    let contextWeights = 0;

    inputWords.forEach(word => {
      weightedInput += tfIdfWeights[word] || 0;
    });

    inputWords.forEach(word => {
      inputWords.forEach(coWord => {
        if (word !== coWord) {
          const pair = [word, coWord].sort().join(' ');
          contextWeights += coOccurrences[pair] || 0;
        }
      });
    });

    newDataset.push({
      input: item.input,
      output: item.output,
      weightedInput,
      contextWeights,
    });
  });
  
  return newDataset;

  const uniqueWords = Object.keys(wordCounts);
  uniqueWords.forEach(word => {
    // Pembelajaran kontekstual lebih lanjut bisa dilakukan di sini,
    // Misalnya dengan menghitung co-occurrence lebih lanjut
    // atau menganalisis kata-kata yang sering muncul bersama-sama
  });
}