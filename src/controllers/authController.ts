import { findUniqueUserByEmail, createUser, findAllUser, findUniqueUserById } from "../services/userService";
import { Request, Response } from "express";
import { generateJwtToken } from "../middleware/jwt";
import { User } from "../models/user";

//TO DO: add actual password hashing
export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUserByEmail(email);

    if (user) {
      const token = generateJwtToken(user.userId);
      return res.status(200).json({
        status: "success",
        token: token,
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "User not found so sorry",
    });
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  const user: User = req.body;
  const existingUser = await findUniqueUserByEmail(user.email);

  if (existingUser) {
    return res.status(409).json({
      status: "error",
      message: "User already exists",
    });
  }

  await createUser(user);
  const newUser = await findUniqueUserByEmail(user.email);
  const token = generateJwtToken(newUser!.userId);

  return res.status(200).json({
    status: "success",
    token: token,
  });
};

export const getAllUserHandler = async (req: Request, res: Response) => {
  try {
    const users = await findAllUser();
    return res.status(200).json({ users });
    
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({ error: "Failed to get users" });
  }
};

export const getSingleUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await findUniqueUserById(id);
    console.log(user);
    return res.status(200).json({ user });
    
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ error: "Failed to get user" });
  }
}
