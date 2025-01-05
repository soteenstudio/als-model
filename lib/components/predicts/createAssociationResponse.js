export function createAssociationResponse(associations, prompt) {
  const words = prompt.toLowerCase().split(' ');
  const relevance = {};
  
  words.forEach(word => {
    if (associations[word]) {
      associations[word].forEach(entry => {
        if (!relevance[entry.word]) {
          relevance[entry.word] = 0;
        }
        
        relevance[entry.word] += entry.score;
      });
    }
  });
  
  const sortedWords1 = Object.entries(relevance).sort((a, b) => b[1] - a[1]).map(entry => entry[0]).slice(0, 12);
  const sortedWords2 = Object.entries(relevance).sort((a, b) => a[1] - b[1]).map(entry => entry[0]).slice(0, 12);
  
  const response = [];
  sortedWords1.forEach(item => {
    if (sortedWords2.includes(item)) {
      response.push(item);
    }
  });
  
  if (response.length > 1) {
    return response.slice(0, 5).join(' ');
  } else {
    return "Maaf, saya tidak mengerti.";
  }
}