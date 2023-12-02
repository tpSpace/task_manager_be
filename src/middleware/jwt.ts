import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const generateJwtToken = (): string => {
  const issuer = "tuesday";
  const expiresIn = "100d";
  const payload = {};
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
      if (decodedToken.iss === "tuesday") {
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
