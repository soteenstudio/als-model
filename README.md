# Active Learning System(ALS) Model
**Active Learning System(ALS) model** is an artificial intelligence model equipped with active learning.

> **Caution:** This model is still under development and far from perfect. Please use it wisely.

# Get Started
Follow the simple steps below to start using this model:
## Installation
Use npm to install packages:
```
npm install @soteen/als-model
```
## Import
Import the ``@soteen/als-model`` module into your project:
```javascript
import { ALSModel } from '@soteen/als-model';
```
## Initialization and Usage
Here is an example of a simple implementation:
```javascript
// Initialize an instance of the ALSModel class
const model = new ALSModel({
  model: "ALS-v0.1-alpha",
  maxLength: 12
});


// Send prompts and get responses
const result = model.response({ user: 'guess', prompt: 'How are you?' });

// Show response results in console
console.log(result.details.response);
```