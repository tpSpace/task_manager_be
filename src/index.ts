import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(`/api/v1/login`, authRouter);


function cors(): any {
    throw new Error('Function not implemented.');
}

