import express from 'express';
import { validate } from '../middleware/validate';

const router = express.Router();

router.post('/login', validate(), loginUserHandler);

export default router;