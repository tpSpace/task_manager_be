import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretKey = 'b442b5760963c12fbd0d3e3d04e2c6cf38296ae9d69b7b5c2870d2d307c9d8b0';

export const generateJwtToken = (): string => {
  const issuer = 'tuesday';
  const expiresIn = '100d'; 
  const token = jwt.sign({}, secretKey, {
    issuer,
    expiresIn,
  });

  return token;
};

export const validateAndAuthorizeToken = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = jwt.verify(token, secretKey) as { iss?: string };      
      if (decodedToken.iss === 'tuesday') {

        next();
      } else {
        res.status(401).json({ error: 'Unauthorized 1' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized 2' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized 3' });
  }
};
