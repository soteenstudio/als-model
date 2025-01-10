import { ALSModel } from '../model.js'

const model = new ALSModel();

let result1 = await model.response({
  user: "guess",
  prompt: "gimana kabar anda sekarang?",
  model: "ALS-v0.1-alpha"
});
let result2 = await model.response({
  user: "guess",
  prompt: "Apa yang kamu pikirkan tentang belajar hal-hal baru?",
  model: "ALS-v0.1-alpha"
});
console.log(result1.details.response);
console.log(result2.details.response);

// console.log(model.data().memory);