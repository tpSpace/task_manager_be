import { findUniqueUser, createUser } from "../services/userService";
import { Request, Response } from "express";
import { generateJwtToken } from "../middleware/jwt";

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUser(email, password);

    const token = generateJwtToken();

    if (user) {
      return res.status(200).json({
        status: "success",
        token: token,
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await findUniqueUser(email, password);

  if (user) {
    return res.status(409).json({
      status: "error",
      message: "User already exists",
    });
  }

  await createUser(name, email, password);
  const token = generateJwtToken();

  return res.status(200).json({
    status: "success",
    token: token,
  });
};
