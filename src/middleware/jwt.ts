import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const generateJwtToken = (userId: string): string => {
  const issuer = "tasKing";
  const expiresIn = "100d";
  const payload = { userId };
  const token = jwt.sign(payload, secretKey!, {
    issuer,
    expiresIn,
  });

  return token;
};

export const validateAndAuthorizeToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, secretKey!) as { iss?: string };
      if (decodedToken.iss === "tasKing") {
        next();
      } else {
        res.status(401).json({ error: "Unauthorized 1" });
      }
    } catch (error) {
      res.status(401).json({ error: "Unauthorized 2" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized 3" });
  }
};

export const returnUserIdFromToken = (req: Request): string => {
  const authHeader = req.headers.authorization;
  const token = authHeader!.split(" ")[1];
  const decodedToken = jwt.verify(token, secretKey!) as { userId?: string };
  const userId = decodedToken.userId as string;
  return userId;
}