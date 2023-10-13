"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, key, expiration) => {
    return jsonwebtoken_1.default.sign(payload, key, {
        expiresIn: expiration,
    });
};
const verifyToken = (token, key) => {
    return jsonwebtoken_1.default.verify(token, key);
};
const JWTHelpers = {
    createToken,
    verifyToken,
};
exports.default = JWTHelpers;
