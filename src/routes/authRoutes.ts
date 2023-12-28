import express from 'express';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { loginUserSchema } from '../schemas/userSchema';
import {
  loginUserHandler,
  loginUserHandlerMongoose,
  registerUserHandler,
  registerUserHandlerMongoose,
  getSingleUserHandler,
  getSingleUserHandlerMongoose
} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', validate(loginUserSchema), loginUserHandlerMongoose);

authRouter.post('/register', validate(loginUserSchema), registerUserHandlerMongoose);

authRouter.get(
  '/user/:userId',
  validateAndAuthorizeToken,
  getSingleUserHandlerMongoose,
);

// Test authrourization end point, to be removed
authRouter.get('/test', validateAndAuthorizeToken, (req, res) =>
  res.send('Hello from secured endpoint!'),
);

export default authRouter;
