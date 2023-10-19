import express, { Request, Response } from "express";
import authRouter from "./routes/authRoute";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
