import { ALSModel } from '../model.js'

const model = new ALSModel();

const result = model.response({ user: "guess", prompt: "gimana kabarmu?" });
console.log(result.details.response);