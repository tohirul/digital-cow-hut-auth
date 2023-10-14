"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Creates a JSON Web Token (JWT) using the provided payload, secret key, and expiration time.
 * @function
 * @param {Record<string, unknown>} payload - Data to be included in the JWT payload.
 * @param {Secret} key - Secret key used for signing the JWT.
 * @param {string} expiration - Expiration time for the JWT (e.g., '1d' for one day).
 * @returns {string} - Generated JWT string.
 */
const createToken = (payload, key, expiration) => {
    return jsonwebtoken_1.default.sign(payload, key, {
        expiresIn: expiration,
    });
};
/**
 * Verifies a JSON Web Token (JWT) using the provided token and secret key.
 * @function
 * @param {string} token - JWT to be verified.
 * @param {Secret} key - Secret key used for verifying the JWT.
 * @returns {JwtPayload} - Decoded payload of the verified JWT.
 * @throws {Error} - If the token verification fails, an error is thrown.
 */
const verifyToken = (token, key) => {
    return jsonwebtoken_1.default.verify(token, key);
};
const JWTHelpers = {
    createToken,
    verifyToken,
};
exports.default = JWTHelpers;
