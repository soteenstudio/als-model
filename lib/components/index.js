// Training components
import { coOccurrence } from './trainings/coOccurrenceAnalysis.js';
import { tfidf } from './trainings/tfidfAnalysis.js';

// Prediction components
import { computeSimilarity } from './predicts/computeSimilarity.js'
import { createVariedResponse } from './predicts/createVariedResponse.js'

// Active learning components
import { createAutomatedInput } from './activeLearnings/createAutomatedInput.js';
import { createAutomatedOutput } from './activeLearnings/createAutomatedOutput.js';

export { 
  coOccurrence,
  tfidf,
  computeSimilarity,
  createVariedResponse,
  createAutomatedInput, 
  createAutomatedOutput
};