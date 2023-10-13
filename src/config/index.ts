import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from a .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

/**
 * Application Configuration Module
 *
 * This module loads environment variables and exports them as configuration options.
 */
export default {
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
    jwt_refresh_token_expires_in:
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY_EXPIRY,
  },
};
