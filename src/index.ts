import express, { Request, Response } from "express";
import authRouter from "./routes/authRoute";
import projectRouter from "./routes/projectRoutes";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());
app.use("/auth", authRouter);
app.use("/projects", projectRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
