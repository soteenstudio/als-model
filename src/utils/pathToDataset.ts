import { readFileSync } from 'fs';
import path from 'path';

interface Dataset {
  input: string;
  output: string;
}

export function pathToDataset(filePath: string): Dataset | null { // Kembalikan Dataset atau null
  try {
    const data = readFileSync(path.join(__dirname, filePath), 'utf8');

    try { // Nested try-catch untuk JSON.parse
      const parsedData: Dataset = JSON.parse(data); // Tipe data untuk parsedData
      return parsedData;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return null; // Kembalikan null jika parsing gagal
    }

  } catch (error) {
    console.error("Error reading file:", error);
    return null; // Kembalikan null jika membaca file gagal
  }
}