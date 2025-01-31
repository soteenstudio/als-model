import { binaryConverter } from './binaryConverter.js';

interface DatasetItem {
  input: string;
  output: string;
}

export function normalizedDataset(dataset: DatasetItem[]): DatasetItem[] {
  return dataset.map(item => ({
    input: binaryConverter(item.input.toLowerCase().replace(/[^\w\s]/g, '')),
    output: binaryConverter(item.output.toLowerCase().replace(/[^\w\s]/g, '')),
  }));
}