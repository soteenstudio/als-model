function extractWords(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
}

export function wordsAssociation(data) {
    let associations = {};

    data.forEach(pair => {
        let inputWords = extractWords(pair.input);
        let outputWords = extractWords(pair.output);

        inputWords.forEach(inputWord => {
            if (!associations[inputWord]) {
                associations[inputWord] = {};
            }

            outputWords.forEach(outputWord => {
                if (!associations[inputWord][outputWord]) {
                    associations[inputWord][outputWord] = 0;
                }
                associations[inputWord][outputWord] += 1;
            });
        });
    });

    let synonyms = {};
    for (let inputWord in associations) {
        let relatedWords = Object.entries(associations[inputWord])
            .sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan frekuensi
            .map(([word, frequency]) => {
                return { word, score: frequency };
            });

        synonyms[inputWord] = relatedWords;
    }

    data.forEach(pair => {
        let outputWords = extractWords(pair.output);
        outputWords.forEach(outputWord => {
            if (!(outputWord in synonyms)) {
                synonyms[outputWord] = [];
            }
        });
    });

    for (let inputWord in synonyms) {
        let words = synonyms[inputWord];
        if (words.length > 1) {
            words.forEach(wordData => {
                if (wordData.score === 1) {
                    wordData.score += 0.5;
                }
            });
        }
    }

    return synonyms;
}