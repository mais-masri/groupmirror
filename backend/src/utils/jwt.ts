import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export const signJwt = (payload: JwtPayload, exp: string = '7d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: exp });
};

export const verifyJwt = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

