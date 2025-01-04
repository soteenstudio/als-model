import fs from 'fs';
import { Model } from './lib/index.js';

let datasetJson;
try {
  let dataset = fs.readFileSync('./lib/data/input-output-dataset.json', 'utf8');
  datasetJson = JSON.parse(dataset, null, 2);
} catch {
  console.log('Failed to read dataset');
}

export class ALSModel {
  constructor(option) {
    this.model = new Model();
    this.model.train(datasetJson);
  }
  
  response(input) {
    const user = input.user;
    const prompt = input.prompt;
    
    const response = this.model.predict(prompt);
    
    return {
      user: user,
      details: {
        prompt: prompt,
        response: response
      }
    };
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