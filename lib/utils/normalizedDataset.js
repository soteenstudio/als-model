import { binaryConverter } from './binaryConverter.js';

export function normalizedDataset(dataset) {
  dataset = dataset.map(item => ({
    input: binaryConverter(item.input.toLowerCase().replace(/[^\w\s]/g, '')),
    output: binaryConverter(item.output.toLowerCase()),
  }));
    
  return dataset;
}