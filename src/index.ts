import { writeFileSync } from 'fs'; // Pastikan sudah di-install: npm install --save-dev @types/node
import path from 'path'; // Pastikan sudah di-install: npm install --save-dev @types/node
import {
  normalizedDataset,
  normalizedText,
  pathToDataset,
  binaryConverter
} from './utils/index.js'; // Periksa path
import { coOccurrence } from './components/nlp/coOccurrenceAnalysis.js'; // Periksa path
import { tfidf } from './components/nlp/tfidfAnalysis.js'; // Periksa path
import { wordsAssociation } from './components/nlp/associationAnalysis.js'; // Periksa path
import { computeSimilarity } from './components/predicts/computeSimilarity.js'; // Periksa path
import { createVariedResponse } from './components/predicts/createVariedResponse.js'; // Periksa path
import { createAutomatedInput } from './components/activeLearnings/createAutomatedInput.js'; // Periksa path
import { createAutomatedOutput } from './components/activeLearnings/createAutomatedOutput.js'; // Periksa path
import { createAssociationResponse } from './components/predicts/createAssociationResponse.js'; // Periksa path

interface DatasetItem {
  input: string;
  output: string;
  weightedInput?: number;
  contextWeights?: number;
}

interface LessonItem {
  input: string;
  output: string;
}

interface MemoryItem {
  input: string;
  output: string;
}

interface TokenItem {
  input: string[];
  output: string[];
}

interface Associations {
  [key: string]: any; // Ganti 'any' dengan tipe yang lebih spesifik jika memungkinkan
}

export class Model {
  dataset: DatasetItem[];
  memory: MemoryItem[];
  tokens: TokenItem[];
  associations: string; // Simpan sebagai string JSON

  constructor() {
    this.dataset = [];
    this.memory = [];
    this.tokens = [];
    this.associations = ""; // Inisialisasi string kosong
  }

  train(dataset: DatasetItem[]): void { // Ganti 'any' dengan tipe data dataset yang sesuai
    this.dataset = normalizedDataset(dataset);

    const data = coOccurrence(this.dataset);
    this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });

    const associations = wordsAssociation(this.dataset);
    this.associations = JSON.stringify(associations, null, 2);
    writeFileSync('./dist/data/association-dataset.json', this.associations); // Gunakan writeFileSync dari fs
  }

  predict(input: string, binary: number): string {
    const normalizedInput = normalizedText(binaryConverter(input));
    const inputTokens = normalizedInput.split(' ');

    const response = createAssociationResponse(pathToDataset('../data/association-dataset.json'), normalizedInput);
    if (response) {
      this.memory.push({ input: normalizedInput, output: response });
      return response.split(' ').map(wordBinary => {
        return wordBinary.match(new RegExp('.{8}', 'g'))
          ?.map(bin => String.fromCharCode(parseInt(bin, 2))) // Tambahkan optional chaining (?.)
          .join('');
      }).slice(0, binary).join(' ');
    }

    let bestMatch: DatasetItem | null = null;
    let highestScore = 0;

    for (const item of this.dataset) {
      const wordSimilarityScore = computeSimilarity(inputTokens, item.input.split(' '));

      let weightedScore = 0;
      item.input.split(' ').forEach(word => {
        if (inputTokens.includes(word)) {
          weightedScore += (item.weightedInput || 0) + (item.contextWeights || 0);
        }
      });

      const finalScore = wordSimilarityScore + weightedScore;

      if (finalScore > highestScore) {
        highestScore = finalScore;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0.3) {
      const response = createVariedResponse(this.dataset, this.tokens, bestMatch.output);

      this.tokens.push({ input: inputTokens, output: response.split(' ') });
      this.memory.push({ input: normalizedInput, output: response });
      return response;
    } else {
      return "Maaf, saya tidak mengerti...";
    }
  }

  learn(lesson: LessonItem): void { // Ganti 'any' dengan tipe data lesson yang sesuai
    let input: string | undefined;
    let output: string | undefined;

    if (typeof lesson === "object" && lesson !== null) { // Tambahkan pengecekan null
      input = lesson.input;
      output = lesson.output;
    }

    if (input && output) {
      const normalizedInput = input.toLowerCase().replace(/[^\w\s]/g, '');
      const normalizedOutput = output.toLowerCase();
      this.dataset.push({ input: normalizedInput, output: normalizedOutput });

      const data = coOccurrence(this.dataset);
      this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });

      const associations = wordsAssociation(this.dataset);
      this.associations = JSON.stringify(associations, null, 2);
      writeFileSync('./dist/data/association-dataset.json', this.associations);
    } else if (typeof lesson === "string") {
      const input = createAutomatedInput(lesson);
      const output = createAutomatedOutput(lesson);
      this.dataset.push({ input, output });

      const data = coOccurrence(this.dataset);
      this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });
    }
  }

  showData(): { dataset: DatasetItem[]; memory: MemoryItem[]; tokens: TokenItem[]; associations: string } {
    return {
      dataset: this.dataset,
      memory: this.memory,
      tokens: this.tokens,
      associations: this.associations
    };
  }
}