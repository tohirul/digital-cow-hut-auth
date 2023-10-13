'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const cow_constant_1 = require('./cow.constant');
const mongoose_1 = __importStar(require('mongoose'));
const cowSchema = new mongoose_1.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    enum: cow_constant_1.landmarkEnumValues,
    required: true,
  },
  breed: {
    type: String,
    enum: cow_constant_1.breedEnumValues,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: cow_constant_1.Label.ForSale,
    enum: cow_constant_1.labelEnumValues,
  },
  category: {
    type: String,
    enum: cow_constant_1.categoryEnumValues,
  },
  seller: {
    type: mongoose_1.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
const Cow = mongoose_1.default.model('Cow', cowSchema);
exports.default = Cow;
