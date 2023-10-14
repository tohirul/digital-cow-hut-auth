import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

/**
 * Creates a JSON Web Token (JWT) using the provided payload, secret key, and expiration time.
 * @function
 * @param {Record<string, unknown>} payload - Data to be included in the JWT payload.
 * @param {Secret} key - Secret key used for signing the JWT.
 * @param {string} expiration - Expiration time for the JWT (e.g., '1d' for one day).
 * @returns {string} - Generated JWT string.
 */
const createToken = (
  payload: Record<string, unknown>,
  key: Secret,
  expiration: string,
): string => {
  return jwt.sign(payload, key as Secret, {
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
const verifyToken = (token: string, key: Secret): JwtPayload => {
  return jwt.verify(token, key as Secret) as JwtPayload;
};

const JWTHelpers = {
  createToken,
  verifyToken,
};

export default JWTHelpers;
