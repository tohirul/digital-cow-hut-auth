"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from a .env file
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
/**
 * Application Configuration Module
 *
 * This module loads environment variables and exports them as configuration options.
 */
exports.default = {
    /**
     * The application environment (e.g., 'development', 'production', 'test').
     */
    env: process.env.NODE_ENV,
    /**
     * The port number on which the server should listen.
     */
    port: process.env.PORT,
    /**
     * The URL of the MongoDB database used by the application.
     */
    database_url: process.env.DATABASE_URL,
    /**
     * The BCRYPT encryption SALT count
     */
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        jwt_access_token_key: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        jwt_refresh_token_key: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_SECRET_KEY_EXPIRY,
        jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_SECRET_KEY_EXPIRY,
    },
};
