interface TFIDFData {
  wordCounts: { [word: string]: number };
  coOccurrences: { [pair: string]: number };
}

interface TFIDFResultItem {
  input: string;
  output: string;
  weightedInput: number;
  contextWeights: number;
}

export function tfidf(dataset: { input: string; output: string }[], data: TFIDFData): TFIDFResultItem[] {
  const wordCounts = data.wordCounts;
  const coOccurrences = data.coOccurrences;
  const newDataset: TFIDFResultItem[] = [];

  const totalWords = Object.keys(wordCounts).length;
  const wordWeights: { [word: string]: number } = {};

  for (const word in wordCounts) {
    wordWeights[word] = wordCounts[word] / totalWords;
  }

  const totalDocuments = dataset.length;
  const wordIdfs: { [word: string]: number } = {};

  for (const word in wordCounts) {
    let docCount = 0;

    dataset.forEach(item => {
      if (item.input.includes(word)) {
        docCount++;
      }
    });

    wordIdfs[word] = Math.log(totalDocuments / (docCount + 1));
  }

  const tfIdfWeights: { [word: string]: number } = {};
  for (const word in wordWeights) {
    tfIdfWeights[word] = wordWeights[word] * wordIdfs[word];
  }

  dataset.forEach(item => { // Menggunakan forEach langsung, tidak perlu map lalu assign lagi
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

  // Kode di bawah ini tidak akan pernah dieksekusi karena return sudah dipanggil sebelumnya
  // const uniqueWords = Object.keys(wordCounts);
  // uniqueWords.forEach(word => {
  //   // Pembelajaran kontekstual lebih lanjut bisa dilakukan di sini,
  //   // Misalnya dengan menghitung co-occurrence lebih lanjut
  //   // atau menganalisis kata-kata yang sering muncul bersama-sama
  // });
}