import express from 'express';
import { validate } from '../middleware/validate';
import { loginUserSchema } from '../schemas/user.schema';
import { loginUserHandler } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', validate(loginUserSchema), loginUserHandler);

export default router;