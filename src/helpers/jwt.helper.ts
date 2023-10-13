import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  key: Secret,
  expiration: string,
): string => {
  return jwt.sign(payload, key as Secret, {
    expiresIn: expiration,
  });
};

const verifyToken = (token: string, key: Secret): JwtPayload => {
  return jwt.verify(token, key as Secret) as JwtPayload;
};

const JWTHelpers = {
  createToken,
  verifyToken,
};

export default JWTHelpers;
