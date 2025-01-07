function extractWordsAndPunctuation(text) {
    // Ekstrak kata sambil mempertahankan koma dan titik sebagai entitas terpisah
    return text.toLowerCase().match(/[\w]+|[,\.]/g) || [];
}

// Fungsi untuk menentukan tipe kata dengan mempertimbangkan tanda baca
function determineWordTypeWithPunctuation(word, index, words) {
    const previousWord = index > 0 ? words[index - 1] : null;
    const nextWord = index < words.length - 1 ? words[index + 1] : null;

    if (word === ',' || word === '.') {
        return null; // Abaikan tanda baca, tetapi memanfaatkannya sebagai pembatas
    }

    if (index === 0 || (previousWord === '.' && index > 0)) {
        return 'subjek'; // Kata pertama setelah titik atau di awal dianggap subjek
    }

    if (previousWord === ',' && nextWord && nextWord !== '.') {
        return 'keterangan'; // Kata setelah koma dianggap sebagai keterangan
    }

    if (index === words.length - 1 || nextWord === '.') {
        return 'objek'; // Kata terakhir sebelum titik dianggap objek
    }

    return 'predikat'; // Kata lainnya dianggap predikat
}

export function wordsAssociation(data) {
    let associations = {};

    data.forEach(pair => {
        let inputWords = extractWordsAndPunctuation(pair.input);
        let outputWords = extractWordsAndPunctuation(pair.output);

        inputWords.forEach((inputWord, inputIndex) => {
            if (inputWord === ',' || inputWord === '.') return; // Abaikan tanda baca
            let inputType = determineWordTypeWithPunctuation(inputWord, inputIndex, inputWords);

            if (!associations[inputWord]) {
                associations[inputWord] = {};
            }

            outputWords.forEach((outputWord, outputIndex) => {
                if (outputWord === ',' || outputWord === '.') return; // Abaikan tanda baca
                let outputType = determineWordTypeWithPunctuation(outputWord, outputIndex, outputWords);

                if (!associations[inputWord][outputWord]) {
                    associations[inputWord][outputWord] = { score: 0, types: new Set() };
                }

                associations[inputWord][outputWord].score += 1;
                associations[inputWord][outputWord].types.add(outputType);
            });
        });
    });

    let synonyms = {};
    for (let inputWord in associations) {
        let relatedWords = Object.entries(associations[inputWord])
            .sort((a, b) => b[1].score - a[1].score) // Urutkan berdasarkan frekuensi
            .map(([word, data]) => {
                return { word, score: data.score, types: Array.from(data.types) };
            });

        synonyms[inputWord] = relatedWords;
    }

    return synonyms;
}