import { ALSModel } from '../model.js'

const model = new ALSModel();

const result = await model.response({ user: "guess", prompt: "halo" });
console.log(result.details.response);