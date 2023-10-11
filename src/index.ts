import express, { Request, Response } from 'express';
import authRouter from './routes/auth.routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// app.use(cors);
app.use(express.json());

app.use('/auth', authRouter);
// set port to 30000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
console.log(`Server listening on port ${port}`);