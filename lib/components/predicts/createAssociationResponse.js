function sortWordsByType(relevance, words) {
  const subject = [];
  const predicate = [];
  const object = [];
  const information = [];

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
  
  subject.sort((a, b) => b.score - a.score);
  predicate.sort((a, b) => b.score - a.score);
  object.sort((a, b) => b.score - a.score);
  information.sort((a, b) => b.score - a.score);
  
  subject.forEach(({ word, score }) => {
    for (let i = 0; i <= words.length; i++) {
      if (word === words[i]) {
        subject.sort((a, b) => a.score - b.score);
      }
    }
  });

  const highestSubject = subject.slice(0, 3).map(entry => entry.word);
  const highestPredicate = predicate.slice(0, 3).map(entry => entry.word);
  const highestObject = object.slice(0, 3).map(entry => entry.word);
  const highestInformation = information.slice(0, 3).map(entry => entry.word);

  const combinedWords = [...highestSubject, ...highestPredicate, ...highestInformation, ...highestObject];

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
  
  const response = sortWordsByType(relevance, words);
  if (response.length > 1) {
    return response;
  } else {
    return "Maaf, saya tidak mengerti.";
  }
}