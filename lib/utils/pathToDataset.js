import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function pathToDataset(filePath) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return {}
  }
}