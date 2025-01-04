export function createVariedResponse(dataset, tokens, output) {
  const sentences = output.split('.').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0);

  if (tokens.length > 0) {
    const lastToken = tokens[tokens.length - 1].input.slice(-1)[0];

    const relatedSentences = sentences.filter(sentence => sentence.includes(lastToken));

    if (relatedSentences.length > 0) {
      const randomIndex = Math.floor(Math.random() * relatedSentences.length);
      return replaceWithWeightedWords(dataset, relatedSentences[randomIndex]) + '.';
    }
  }

  if (sentences.length > 1) {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return replaceWithWeightedWords(dataset, sentences[randomIndex]) + '.';
  } else {
    return replaceWithWeightedWords(dataset, sentences[0]) + '.';
  }
}

function replaceWithWeightedWords(dataset, sentence) {
  const words = sentence.split(' ');

  const modifiedWords = words.map(word => {
    const wordWeight = getWordWeight(dataset, word);
    if (wordWeight > 0.5) {
      return getSynonymForWord(word) || word;
    }
    return word;
  });

  return modifiedWords.join(' ');
}

function getWordWeight(dataset, word) {
  let weight = 0;

  dataset.forEach(item => {
    if (item.input.split(' ').includes(word)) {
      weight += (item.weightedInput || 0) + (item.contextWeights || 0);
    }
  });

  return weight;
}

function getSynonymForWord(word) {
  const synonyms = {
    "makan": "makanan",
    "sakit": "terluka",
    // Tambahkan sinonim lainnya
  };

  return synonyms[word] || null;
}