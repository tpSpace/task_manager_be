import { findUserByEmail, createUser, findAllUser, findUserById } from "../services/userService";
import { Request, Response } from "express";
import { generateJwtToken } from "../middleware/jwt";
import { User } from "../models/user";
const bcrypt = import("bcrypt-ts");

export const loginUserHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found so sorry",
    });
  } 
  else {
    const isPasswordMatch = (await bcrypt).compareSync(password, user.password);
    if (isPasswordMatch) {
      const token = generateJwtToken(user.userId);
      return res.status(200).json({
        status: "success",
          token: token,
        });
    } 
    else { 
      return res.status(401).json({
        status: "Unauthorized",
        message: "Wrong password",
      });
    }
  } 
};

export const registerUserHandler = async (req: Request, res: Response) => {
  const user: User = req.body;
  const existingUser = await findUserByEmail(user.email);

  if (existingUser) {
    return res.status(409).json({
      status: "error",
      message: "User already exists",
    });
  }

  const hashedPassword = await (await bcrypt).hashSync(user.password, 10); // 10 is the number of salt rounds
  user.password = hashedPassword;

  await createUser(user);
  const newUser = await findUserByEmail(user.email);
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
    const user = await findUserById(id);
    console.log(user);
    return res.status(200).json({ user });
    
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ error: "Failed to get user" });
  }
}
