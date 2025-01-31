import { binaryConverter } from '../../utils/binaryConverter.js';

let feedbackData = {}; // Menyimpan data relevansi berdasarkan feedback

function updateRelevance(relevance, feedback) {
  Object.entries(feedback).forEach(([word, adjustment]) => {
    if (relevance[word]) {
      relevance[word].score += adjustment; // Perbarui skor berdasarkan feedback
    }
  });
}

function collectFeedback(predictedWords, actualWords) {
  let feedback = {};
  actualWords.forEach((word, index) => {
    if (!predictedWords.includes(word)) {
      // Jika kata tidak diprediksi, tambahkan penalti
      feedback[word] = feedback[word] ? feedback[word] - 1 : -1;
    } else {
      // Jika kata diprediksi, tambahkan bonus
      feedback[word] = feedback[word] ? feedback[word] + 1 : 1;
    }
  });
  return feedback;
}

function sortWordsByTypeWithFeedback(relevance, words, actualWords) {
  const subject = [];
  const predicate = [];
  const object = [];
  const information = [];

  // Pisahkan kata berdasarkan tipe
  Object.entries(relevance).forEach(([word, entry]) => {
    if (entry.types.includes('subject')) {
      subject.push({ word, score: entry.score });
    }
    if (entry.types.includes('predicate')) {
      predicate.push({ word, score: entry.score });
    }
    if (entry.types.includes('object')) {
      object.push({ word, score: entry.score });
    }
    if (entry.types.includes('information')) {
      information.push({ word, score: entry.score });
    }
  });

  // Urutkan berdasarkan skor
  subject.sort((a, b) => b.score - a.score);
  predicate.sort((a, b) => b.score - a.score);
  object.sort((a, b) => b.score - a.score);
  information.sort((a, b) => b.score - a.score);

  const highestSubject = subject.slice(0, 3).map(entry => entry.word);
  const highestPredicate = predicate.slice(0, 3).map(entry => entry.word);
  const highestObject = object.slice(0, 3).map(entry => entry.word);
  const highestInformation = information.slice(0, 3).map(entry => entry.word);

  const combinedWords = [...highestSubject, ...highestPredicate, ...highestInformation, ...highestObject];
  
  // Feedback loop
  const feedback = collectFeedback(combinedWords, actualWords);
  updateRelevance(relevance, feedback);

  return combinedWords.join(' ').trim();
}

export function createAssociationResponse(associations, prompt) {
  const words = prompt.toLowerCase().split(' ');
  const relevance = {};
  
  words.forEach(word => {
      if (associations[word]) {
          associations[word].forEach(entry => {
              if (!relevance[entry.word]) {
                  relevance[entry.word] = { score: 0, types: new Set() };
              }
  
              relevance[entry.word].score += entry.score;
              entry.types.forEach(type => relevance[entry.word].types.add(type));
          });
      }
  });
  
  for (const key in relevance) {
      relevance[key].types = Array.from(relevance[key].types);
  }
  
  const actualWords = words;
  //const actualWords = ['hindu', 'terbanyak', 'di', 'india', 'halo', 'juga'];
  const newActualWords = [];
  
  for (let l = 0; l < actualWords.length; l++) {
    newActualWords.push(binaryConverter(actualWords[l]));
  }
  
  const response = sortWordsByTypeWithFeedback(relevance, words, newActualWords);
  if (response.length > 0) {
    return response;
  } else {
    // return response;
    return "0100110101100001011000010110011000101100 01110011011000010111100101100001 0111010001101001011001000110000101101011 011011010110010101101110011001110110010101110010011101000110100100101110";
  }
}