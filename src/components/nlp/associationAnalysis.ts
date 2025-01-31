import { coOccurrence } from './coOccurrenceAnalysis.js'; // Pastikan file ini juga dalam TS atau memiliki deklarasi tipe
import { tfidf } from './tfidfAnalysis.js'; // Pastikan file ini juga dalam TS atau memiliki deklarasi tipe

function extractWordsAndPunctuation(text: string): string[] {
  const matches = text.toLowerCase().match(/[\w]+|[,\.]/g);
  return matches ? matches : []; // Mengembalikan array kosong jika tidak ada match
}

function determineWordTypeWithPunctuation(word: string, index: number, words: string[]): string | null {
  const previousWord = index > 0 ? words[index - 1] : null;
  const nextWord = index < words.length - 1 ? words[index + 1] : null;

  if (['.', ',', '!', '?'].includes(word)) {
    return null;
  }

  if (index === 0 || (previousWord === '.' && index > 0)) {
    return 'subject';
  }

  if (previousWord === ',' && nextWord && !['.', '?', '!'].includes(nextWord)) {
    return 'information';
  }

  if (index === words.length - 1 || ['.', '?', '!'].includes(nextWord)) {
    return 'object';
  }

  if (previousWord && previousWord.endsWith('!')) {
    return 'predicate';
  }

  if (previousWord && previousWord.endsWith('?')) {
    return 'predicate';
  }

  const prepositions: string[] = [ // Tipe data eksplisit untuk prepositions
    'ke', 'di', 'dari', 'pada', 'untuk',
    'dengan', 'oleh', 'tentang', 'sebagai',
    'sebelum', 'sesudah', 'antara', 'selama', 'selain',
    'diantara', 'pada', 'untuk', 'terhadap',
    'melalui', 'di dalam', 'di luar', 'di atas', 'di bawah',
    'berdasarkan', 'karena', 'untuk', 'menghadapi'
  ];

  if (prepositions.includes(word)) {
    return 'object';
  }

  return 'predicate';
}

interface WordAssociationData {
  score: number;
  types: string[];
}

interface AssociationResults {
  [inputWord: string]: {
    word: string;
    score: number;
    types: string[];
  }[];
}

export function wordsAssociation(data: any[]): AssociationResults { // Tipe data untuk data, sesuaikan jika perlu
  const coOccurrenceResults = coOccurrence(data);
  const tfidfResults = tfidf(data, { wordCounts: coOccurrenceResults.wordCounts, coOccurrences: coOccurrenceResults.coOccurrences });

  const associations: { [inputWord: string]: { [outputWord: string]: WordAssociationData } } = {};

  tfidfResults.forEach(pair => {
    const inputWords = extractWordsAndPunctuation(pair.input);
    const outputWords = extractWordsAndPunctuation(pair.output);
    const weightedInput = pair.weightedInput; // Gunakan jika diperlukan
    const contextWeights = pair.contextWeights; // Gunakan jika diperlukan

    inputWords.forEach((inputWord, inputIndex) => {
      if (inputWord === '00101100' || inputWord === '00101110') return;
      const inputType = determineWordTypeWithPunctuation(inputWord, inputIndex, inputWords);

      if (inputType) { // Pastikan inputType tidak null
        if (!associations[inputWord]) {
          associations[inputWord] = {};
        }

        outputWords.forEach((outputWord, outputIndex) => {
          if (outputWord === ',' || outputWord === '.') return;
          const outputType = determineWordTypeWithPunctuation(outputWord, outputIndex, outputWords);
          if (outputType) { // Pastikan outputType tidak null
            if (!associations[inputWord][outputWord]) {
              associations[inputWord][outputWord] = { score: 0, types: [] };
            }

            associations[inputWord][outputWord].score += 1;
            if (!associations[inputWord][outputWord].types.includes(outputType)) { // cek duplikat
                associations[inputWord][outputWord].types.push(outputType)
            }
          }
        });
      }
    });
  });

  const associationResults: AssociationResults = {};
  for (const inputWord in associations) {
    const relatedWords = Object.entries(associations[inputWord])
      .sort(([, a], [, b]) => b.score - a.score) // Destructuring di sini
      .map(([word, data]) => ({ word, score: data.score, types: data.types }));

    associationResults[inputWord] = relatedWords;
  }

  return associationResults;
}