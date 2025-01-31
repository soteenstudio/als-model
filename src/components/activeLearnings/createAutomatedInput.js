export function createAutomatedInput(information) {
  const deleteWords = [
    'dari', 'yang', 'diciptakan', 'apa', 'kapan', 'jadi', 'gini', 'gitu', 'adalah', 'oleh'
  ];

  const parts = information.split('oleh');
  const created = parts.length > 1 ? parts[1].trim() : '';

  const deleteRegex = new RegExp(`\\b(${deleteWords.join('|')})\\b`, 'gi');
  
  let topic = information.replace(deleteRegex, '').replace(/\s+/g, ' ').trim();

  const topicTokens = topic.toLowerCase().replace(/[^\w\s]/g, '').split(' ');

  const stemmedTokens = topicTokens.map(token => token.replace(/(kan|nya|mu|ku|i|in|an)$/i, ''));

  const data = arrangeWordsByTopic(stemmedTokens, created.replace(/[^\w\s]/g, ''));

  const importantWords = stemmedTokens.filter(word => word.length > 2 && !deleteWords.includes(word));

  return data;
}

function arrangeWordsByTopic(input, created) {
  const template = [
    "apa itu {topic}",
    "siapa pembuat {topic}",
    "kenapa {creator} membuat {topic}",
    "apakah {creator} adalah pembuat {topic}",
  ];
  
  let inputResult = template[Math.floor(Math.random() * template.length)];
  
  if (created) {
    inputResult = inputResult.replace(/\{topic\}/g, input[0]).replace(/\{creator\}/g, created);
      
    return inputResult;
  } else {
    inputResult = inputResult.replace(/\{topic\}/g, input[0]);
    
    if (!inputResult.includes('{creator}')) {
      return inputResult;
    }
    
    return arrangeWordsByTopic(input, created);
  }
}