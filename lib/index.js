import fs from 'fs';
import path from 'path';
import {
  wordsAssociation,
  normalizedDataset,
  normalizedText,
  pathToDataset
} from './utils/index.js';
import {
  coOccurrence,
  tfidf,
  computeSimilarity,
  createVariedResponse,
  createAutomatedInput,
  createAutomatedOutput,
  createAssociationResponse
} from './components/index.js';

export class Model {
  constructor() {
    this.dataset = [];
    this.memory = [];
    this.tokens = [];
    this.associations = {};
  }

  train(dataset) {
    this.dataset = normalizedDataset(dataset);
    
    const data = coOccurrence(this.dataset);
    this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });
    
    const associations = wordsAssociation(this.dataset)
    this.associations = JSON.stringify(associations, null, 2);
    fs.writeFileSync('./lib/data/association-dataset.json', this.associations);
  }
  
  predict(input) {
    const normalizedInput = normalizedText(input)
    const inputTokens = normalizedInput.split(' ');
    
    const response = createAssociationResponse(pathToDataset('../data/association-dataset.json'), normalizedInput);
    if (response) {
      return response;
    }
  
    let bestMatch = null;
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
      return "Maaf, saya tidak mengerti.";
    }
  }

  learn(lesson) {
    let input;
    let output;
    if (typeof lesson === "object") {
      input = lesson.input;
      output = lesson.output;
    }
    
    if (input && output) {
      const normalizedInput = input.toLowerCase().replace(/[^\w\s]/g, '');
      const normalizedOutput = output.toLowerCase();
      this.dataset.push({ input: normalizedInput, output: normalizedOutput });
      
      const data = coOccurrence(this.dataset);
      this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });
      
      const associations = wordsAssociation(this.dataset)
      this.associations = JSON.stringify(associations, null, 2);
      fs.writeFileSync('./lib/data/association-dataset.json', this.associations);
    } else if (typeof lesson === "string") {
      const input = createAutomatedInput(lesson);
      const output = createAutomatedOutput(lesson);
      this.dataset.push({ input, output });
      
      const data = coOccurrence(this.dataset);
      this.dataset = tfidf(this.dataset, { wordCounts: data.wordCounts, coOccurrences: data.coOccurrences });
    }
  }

  showData() {
    return {
      dataset: this.dataset,
      memory: this.memory,
      tokens: this.tokens,
      associations: this.associations
    };
  }
}
