import express from 'express';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { loginUserSchema } from '../schemas/userSchema';
import {
  loginUserHandler,
  registerUserHandler,
  getSingleUserHandler,
} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', validate(loginUserSchema), loginUserHandler);

authRouter.post('/register', validate(loginUserSchema), registerUserHandler);

authRouter.get('/user/', validateAndAuthorizeToken, getSingleUserHandler);

// Test authrourization end point, to be removed
authRouter.get('/test', validateAndAuthorizeToken, (req, res) =>
  res.send('Hello from secured endpoint!'),
);

export default authRouter;
