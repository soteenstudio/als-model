# ALS Model
ALS Model is an artificial intelligence model equipped with active learning.
# Get Started
## Installation and Running
```
npm install @soteen/als-model
```
```javascript
import { ALSModel } from '@soteen/als-model';
```
## Using
```javascript
const model = new ALSModel();

const result = model.response({ user: 'guess', prompt: 'How are you?' });
console.log(result.details.response);
```