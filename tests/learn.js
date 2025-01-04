import { ALSModel } from '../model.js';

const model = new ALSModel();

const newData = [
  {
    input: "Apa itu TypeScript?", 
    output: "TypeScript adalah superset dari JavaScript."
  },
  {
    input: "Apa itu NodeJS?",
    output: "Nodejs adalah runtime yang bisa menjalankan JavaScript diluar browser."
  }
];

model.learn({ type: "conversation", data: newData });
console.log(model.data().dataset);