import { readFileSync } from 'fs';
import { pathToDataset } from './dist/utils/index.js'; // This import is not used. Consider removing it.
import { Model } from './dist/index.js';
import { normalizedText } from './dist/utils/index.js';

interface InputData {
  user: string;
  prompt: string;
}

interface DatasetData {
  input: string;
  output: string;
}

interface LessonData {
  type: string;
  data: { input: string; output: string; }[] | string;
}

interface Response {
  user: string;
  details: {
    prompt: string;
    response: string;
  }
}

let datasetJson: DatasetData[] | null = null; // Make datasetJson an array or null
try {
  const dataset: string = readFileSync('./dist/data/input-output-dataset.json', 'utf8');
  datasetJson = JSON.parse(dataset); // Parse as an array of DatasetData
  if (!Array.isArray(datasetJson)) {
    console.error("Dataset file must contain a JSON array of objects.");
    datasetJson = null;
  }
} catch (error) {
  console.error('Failed to read or parse dataset:', error); // More informative error message
  datasetJson = null;
}

export class ALSModel {
  /**
   * API key for model
   * @type {string}
   */
  apiKey: string;
  
  /**
   * The model being used.
   * @type {string}
   */
  modelUsed: string;
  
  /**
   * Maximum length of response.
   * @type {number}
   */
  maxLength: number;
  
  /**
   * The underlying model.
   * @type {Model}
   */
  model: Model;

  /**
   * Constructor for ALSModel.
   * @param {object} data - The initialization data.
   * @param {string} data.apiKey - The API Key.
   * @param {string} data.model - The model to use.
   * @param {number} [data.maxLength=12] - The maximum length of the response.
   */
  constructor(data: { apiKey: string; model: string; maxLength?: number }) {
    this.apiKey = data.apiKey;
    this.modelUsed = data.model;
    this.maxLength = data.maxLength === undefined ? 12 : data.maxLength === 0 ? 0 : data.maxLength; // Simplified maxLength assignment
    this.model = new Model();

    if (datasetJson) { // Only train if datasetJson is valid
      this.model.train(datasetJson);
    } else {
      console.warn("No valid dataset available. Model will not be trained.");
    }
  }

  /**
   * Generates a response from the model.
   * @param {InputData} input - The user input.
   * @returns {Promise<Response>} - A promise that resolves to the model's response.
   */
  async response(input: InputData): Promise<Response> {
    const user: string = input.user;
    const prompt: string = normalizedText(input.prompt);
    const model: string = this.modelUsed;

    if (this.maxLength < 0 || this.maxLength > 12) { // Changed to >= 0 to allow 0
      return {
        user, // Simplified
        details: {
          prompt, // Simplified
          response: "Sorry, max length can only be 0-12." // Updated message
        }
      };
    }

    if (model === "ALS-v0.1-alpha") {
      const response: string = this.model.predict(prompt, this.maxLength);

      return {
        user, // Simplified
        details: {
          prompt, // Simplified
          response // Simplified
        }
      };
    } else {
      return {
        user, // Simplified
        details: {
          prompt, // Simplified
          response: "Sorry, model not found."
        }
      };
    }
  }

  /**
   * Teaches the model new information.
   * @param {LessonData} lesson - The lesson data.
   */
  learn(lesson: LessonData): void {
    const type: string = lesson.type;
    const data: { input: string; output: string }[] | string = lesson.data;

    if (type === "conversation") {
      if (Array.isArray(data)) { // Simplified type check
        data.forEach(item => {
          this.model.learn({ input: item.input, output: item.output });
        });
      }
    } else if (type === "classification") {
      // Implementation for classification learning
    }
  }
}