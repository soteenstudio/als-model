import { ALSModel } from '../model.js'

const model = new ALSModel();

let result = await model.response({
  user: "guess",
  prompt: "Halo",
  model: "ALS-v0.1-alpha"
});
console.log(result.details.response);

// console.log(model.data().memory);