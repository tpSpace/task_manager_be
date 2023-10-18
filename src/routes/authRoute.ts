import express from 'express';
import { validate } from '../middleware/validate';
import {validateAndAuthorizeToken} from '../middleware/jwt';
import { loginUserSchema } from '../schemas/userSchema';
import { loginUserHandler, registerUserHandler } from '../controllers/authController';

const router = express.Router();

router.post(
  '/login', 
  validate(loginUserSchema), 
  loginUserHandler
);

router.post(
  '/register', 
  validate(loginUserSchema), 
  registerUserHandler
);

// Test authrourization end point, to be removed
router.get(
  '/test', 
  validateAndAuthorizeToken, 
  (req, res) => res.send('Hello from secured endpoint!')
);

export default router;