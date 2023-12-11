import {
  findUserByEmail,
  createUser,
  findAllUser,
  findUserById,
} from "../services/userService";
import { Request, Response } from "express";
import { generateJwtToken } from "../middleware/jwt";
import { User } from "../models/user";
import { FastResponse, HttpStatusCode, Action } from "./abstraction";
const bcrypt = import("bcrypt-ts");

export const loginUserHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "User");
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return fr.buildError(
        HttpStatusCode.NOTFOUND,
        Action.FIND,
        "user not found"
      );
    } else {
      const isPasswordMatch = (await bcrypt).compareSync(
        password,
        user.password
      );

      if (isPasswordMatch) {
        const token = generateJwtToken(user.userId);
        return fr.buildSuccess({ token });
      } else {
        return fr.buildError(
          HttpStatusCode.UNAUTHORIZED,
          Action.VALIDATE,
          "wrong password"
        );
      }
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return fr.buildError(
      HttpStatusCode.SERVERERROR,
      Action.VALIDATE,
      "failed to login user"
    );
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "User");
  try {
    const user: User = req.body;
    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
      return fr.buildError(
        HttpStatusCode.CONFLICT,
        Action.CREATE,
        "user already existed"
      );
    }

    const hashedPassword = (await bcrypt).hashSync(user.password, 10); // 10 is the number of salt rounds
    user.password = hashedPassword;

    await createUser(user);
    const newUser = await findUserByEmail(user.email);
    const token = generateJwtToken(newUser!.userId);

    return fr.buildSuccess({ token });
  } catch (error) {
    console.error("Error getting user:", error);
    return fr.buildError(
      HttpStatusCode.SERVERERROR,
      Action.CREATE,
      "failed to register user"
    );
  }
};

export const getSingleUserHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "User");
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    return fr.buildSuccess({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return fr.buildError(
      HttpStatusCode.SERVERERROR,
      Action.READ,
      "failed to get user"
    );
  }
};
