function extractWordsAndPunctuation(text) {
    return text.toLowerCase().match(/[\w]+|[,\.]/g) || [];
}

function determineWordTypeWithPunctuation(word, index, words) {
    const previousWord = index > 0 ? words[index - 1] : null;
    const nextWord = index < words.length - 1 ? words[index + 1] : null;

    if (['.', ',', '!', '?'].includes(word)) {
        return null;
    }

    if (index === 0 || (previousWord === '.' && index > 0)) {
        return 'subject';
    }

    if (previousWord === ',' && nextWord && !['.', '?', '!'].includes(nextWord)) {
        return 'information';
    }

    if (index === words.length - 1 || ['.', '?', '!'].includes(nextWord)) {
        return 'object';
    }

    if (previousWord && previousWord.endsWith('!')) {
        return 'predicate';
    }

    if (previousWord && previousWord.endsWith('?')) {
        return 'predicate';
    }

    const prepositions = [
      'ke', 'di', 'dari', 'pada', 'untuk',   // Preposisi dasar
      'dengan', 'oleh', 'tentang', 'sebagai', // Preposisi penghubung
      'sebelum', 'sesudah', 'antara', 'selama', 'selain', // Preposisi waktu dan hubungan
      'diantara', 'pada', 'untuk', 'terhadap', // Preposisi tambahan waktu dan tujuan
      'melalui', 'di dalam', 'di luar', 'di atas', 'di bawah', // Preposisi tempat
      'berdasarkan', 'karena', 'untuk', 'menghadapi' // Preposisi untuk tujuan atau alasan
    ];
    if (prepositions.includes(word)) {
        return 'object';
    }

    return 'predicate';
}

export function wordsAssociation(data) {
    let associations = {};

    data.forEach(pair => {
        let inputWords = extractWordsAndPunctuation(pair.input);
        let outputWords = extractWordsAndPunctuation(pair.output);

        inputWords.forEach((inputWord, inputIndex) => {
            if (inputWord === ',' || inputWord === '.') return;
            let inputType = determineWordTypeWithPunctuation(inputWord, inputIndex, inputWords);

            if (!associations[inputWord]) {
                associations[inputWord] = {};
            }

            outputWords.forEach((outputWord, outputIndex) => {
                if (outputWord === ',' || outputWord === '.') return;
                let outputType = determineWordTypeWithPunctuation(outputWord, outputIndex, outputWords);

                if (!associations[inputWord][outputWord]) {
                    associations[inputWord][outputWord] = { score: 0, types: new Set() };
                }

                associations[inputWord][outputWord].score += 1;
                associations[inputWord][outputWord].types.add(outputType);
            });
        });
    });

    let associationResults = {};
    for (let inputWord in associations) {
        let relatedWords = Object.entries(associations[inputWord])
            .sort((a, b) => b[1].score - a[1].score)
            .map(([word, data]) => {
                return { word, score: data.score, types: Array.from(data.types) };
            });

        associationResults[inputWord] = relatedWords;
    }

    return associationResults;
}