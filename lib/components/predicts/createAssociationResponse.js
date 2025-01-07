function sortWordsByType(relevance) {
  const subjek = [];
  const predikat = [];
  const objek = [];
  const keterangan = [];

  Object.entries(relevance).forEach(([word, entry]) => {
    if (entry.types.includes('subjek')) {
      subjek.push({ word, score: entry.score });
    }
    if (entry.types.includes('predikat')) {
      predikat.push({ word, score: entry.score });
    }
    if (entry.types.includes('objek')) {
      objek.push({ word, score: entry.score });
    }
    if (entry.types.includes('keterangan')) {
      keterangan.push({ word, score: entry.score });
    }
  });

  subjek.sort((a, b) => b.score - a.score);
  predikat.sort((a, b) => b.score - a.score);
  objek.sort((a, b) => b.score - a.score);
  keterangan.sort((a, b) => b.score - a.score);

  const highestSubjek = subjek.length > 0 ? subjek[0].word : null;
  const highestPredikat = predikat.length > 0 ? predikat[0].word : null;
  const highestObjek = objek.length > 0 ? objek[0].word : null;
  const highestKeterangan = keterangan.length > 0 ? keterangan[0].word : null;

  return [highestSubjek, highestPredikat, highestKeterangan, highestObjek].filter(word => word !== null);
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
  
  const response = sortWordsByType(relevance);
  if (response.length > 1) {
    return response.slice(0, 5).join(' ');
  } else {
    return "Maaf, saya tidak mengerti.";
  }
}