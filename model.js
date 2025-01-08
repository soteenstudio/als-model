import fs from 'fs';
import { pathToDataset } from './lib/utils/index.js';
import { Model } from './lib/index.js';
import { normalizedText } from './lib/utils/index.js';

let datasetJson;
try {
  let dataset = fs.readFileSync('./lib/data/input-output-dataset.json', 'utf8');
  datasetJson = JSON.parse(dataset, null, 2);
} catch {
  console.log('Failed to read dataset');
}

export class ALSModel {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = new Model();
    this.model.train(datasetJson);
  }
  
  async response(input) {
    const user = input.user;
    const prompt = normalizedText(input.prompt);
    const model = input.model;
    
    if (model === "ALS-v0.1-alpha") {
      const response = this.model.predict(prompt);
      
      return {
        user: user,
        details: {
          prompt: prompt,
          response: response
        }
      };
    } else {
      console.log("Sorry, model not found.");
      return '';
    }
  }
  
  learn(lesson) {
    const type = lesson.type;
    const data = lesson.data;
    
    if (type === "conversation") {
      if (typeof data === "object") {
        data.forEach(item => {
          this.model.learn(item.input, item.output);
        });
      } else if (typeof data === "string") {
        this.model.learn(data);
      }
    } else if (type === "classification") {
      //
    }
  }
  
  data() {
    return this.model.showData();
  }
}