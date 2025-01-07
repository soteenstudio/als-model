// Training components
import { coOccurrence } from './trainings/coOccurrenceAnalysis.js';
import { tfidf } from './trainings/tfidfAnalysis.js';
import { wordsAssociation } from './trainings/wordsAssociation.js';

// Prediction components
import { computeSimilarity } from './predicts/computeSimilarity.js';
import { createVariedResponse } from './predicts/createVariedResponse.js';
import { createAssociationResponse } from './predicts/createAssociationResponse.js';

// Active learning components
import { createAutomatedInput } from './activeLearnings/createAutomatedInput.js';
import { createAutomatedOutput } from './activeLearnings/createAutomatedOutput.js';

export { 
  coOccurrence,
  tfidf,
  wordsAssociation,
  computeSimilarity,
  createVariedResponse,
  createAutomatedInput, 
  createAutomatedOutput,
  createAssociationResponse
};