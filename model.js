"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALSModel = void 0;
var fs_1 = require("fs");
var index_js_1 = require("./dist/index.js");
var index_js_2 = require("./dist/utils/index.js");
var datasetJson = null; // Make datasetJson an array or null
try {
    var dataset = (0, fs_1.readFileSync)('./dist/data/input-output-dataset.json', 'utf8');
    datasetJson = JSON.parse(dataset); // Parse as an array of DatasetData
    if (!Array.isArray(datasetJson)) {
        console.error("Dataset file must contain a JSON array of objects.");
        datasetJson = null;
    }
}
catch (error) {
    console.error('Failed to read or parse dataset:', error); // More informative error message
    datasetJson = null;
}
var ALSModel = /** @class */ (function () {
    /**
     * Constructor for ALSModel.
     * @param {object} data - The initialization data.
     * @param {string} data.apiKey - The API Key.
     * @param {string} data.model - The model to use.
     * @param {number} [data.maxLength=12] - The maximum length of the response.
     */
    function ALSModel(data) {
        this.apiKey = data.apiKey;
        this.modelUsed = data.model;
        this.maxLength = data.maxLength === undefined ? 12 : data.maxLength === 0 ? 0 : data.maxLength; // Simplified maxLength assignment
        this.model = new index_js_1.Model();
        if (datasetJson) { // Only train if datasetJson is valid
            this.model.train(datasetJson);
        }
        else {
            console.warn("No valid dataset available. Model will not be trained.");
        }
    }
    /**
     * Generates a response from the model.
     * @param {InputData} input - The user input.
     * @returns {Promise<Response>} - A promise that resolves to the model's response.
     */
    ALSModel.prototype.response = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var user, prompt, model, response;
            return __generator(this, function (_a) {
                user = input.user;
                prompt = (0, index_js_2.normalizedText)(input.prompt);
                model = this.modelUsed;
                if (this.maxLength < 0 || this.maxLength > 12) { // Changed to >= 0 to allow 0
                    return [2 /*return*/, {
                            user: user, // Simplified
                            details: {
                                prompt: prompt, // Simplified
                                response: "Sorry, max length can only be 0-12." // Updated message
                            }
                        }];
                }
                if (model === "ALS-v0.1-alpha") {
                    response = this.model.predict(prompt, this.maxLength);
                    return [2 /*return*/, {
                            user: user, // Simplified
                            details: {
                                prompt: prompt, // Simplified
                                response: response // Simplified
                            }
                        }];
                }
                else {
                    return [2 /*return*/, {
                            user: user, // Simplified
                            details: {
                                prompt: prompt, // Simplified
                                response: "Sorry, model not found."
                            }
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Teaches the model new information.
     * @param {LessonData} lesson - The lesson data.
     */
    ALSModel.prototype.learn = function (lesson) {
        var _this = this;
        var type = lesson.type;
        var data = lesson.data;
        if (type === "conversation") {
            if (Array.isArray(data)) { // Simplified type check
                data.forEach(function (item) {
                    _this.model.learn({ input: item.input, output: item.output });
                });
            }
        }
        else if (type === "classification") {
            // Implementation for classification learning
        }
    };
    return ALSModel;
}());
exports.ALSModel = ALSModel;
