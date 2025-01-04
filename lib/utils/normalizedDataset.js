export function normalizedDataset(dataset) {
  dataset = dataset.map(item => ({
    input: item.input.toLowerCase().replace(/[^\w\s]/g, ''),
    output: item.output.toLowerCase(),
  }));
    
  return dataset;
}