import express from 'express';
import {connectDatabase} from './db/mongoose';

import {userRouter} from './routes/userRoute';

connectDatabase();

export const app = express();

app.use(express.json());
app.use(userRouter);

