# ALS Model API
**Active Learning System(ALS)** is a model that we created with the aim of creating an artificial intelligence model that can **learn actively**.

> **Caution:** This model is still under development and far from perfect. Please use it wisely.

# Get Started
We put a complete and detailed usage guide for this API on our official AI website, specifically on the [Get Started](https://sayals.free.nf/builder/get-started) page. There you will find a complete and detailed usage guide.
### 1. Installation
First of all you have to install our API package first.
```
npm install @soteen/als-model
```
### 2. Import
After successfully installing our API package, you can import ``@soteen/als-model`` into your project.
```javascript
import { ALSModel } from '@soteen/als-model';
```
### 3. Initialization and Usage
Finally, you can use the functions provided.
```javascript
// Initialize an instance of the ALSModel class
const model = new ALSModel({
  apiKey: 'YOUR_API_KEY', // For now, please leave this section blank.
  model: "ALS-v0.1-alpha",
  maxLength: 12
});


// Send prompts and get responses
const result = model.response({ user: 'guess', prompt: 'How are you?' });

// Show response results in console
console.log(result.details.response);
```
# Documentation
We provide all the documentation about this API on our official AI website, specifically on the [Documentation](https://sayals.free.nf/documentation) page. There you can read all the documentation about this API.