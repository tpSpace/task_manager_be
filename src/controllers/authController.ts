import {
  findUserByEmail,
  createUser,
  findAllUser,
  findUserById,
} from '../services/userService';
import { findUserByEmailMongoose, createUserMongoose } from '../services/userServiceMongoose';
import { UserDocument } from '../models/userModel';
import { Request, Response } from 'express';
import { generateJwtToken, returnUserIdFromToken } from '../middleware/jwt';
import { User } from '../models/user';
const bcrypt = import('bcrypt-ts');

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: 'not found',
        message: 'user not found',
      });
    } else {
      const isPasswordMatch = (await bcrypt).compareSync(
        password,
        user.password,
      );
      if (isPasswordMatch) {
        const token = generateJwtToken(user.userId);
        return res.status(200).json({
          status: 'success',
          token: token,
        });
      } else {
        return res.status(401).json({
          status: 'unauthorized',
          message: 'wrong password',
        });
      }
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      status: 'server error',
      message: 'failed to login user',
    });
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const user: UserDocument = req.body;
    const existingUser = await findUserByEmailMongoose(user.email);
    console.log(existingUser);

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        error: 'user already existed',
      });
    }

    // const hashedPassword = await (await bcrypt).hashSync(user.password, 10); // 10 is the number of salt rounds
    // user.password = hashedPassword;

    await createUserMongoose(user);
    // const newUser = await findUserByEmail(user.email);
    // const token = generateJwtToken(newUser!.userId);

    return res.status(200).json({
      status: 'success',
      // token: token,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to register user',
    });
  }
};

export const getSingleUserHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await findUserById(id);
    return res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get user',
    });
  }
};
