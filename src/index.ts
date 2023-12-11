import express, { Request, Response } from "express";
import authRouter from "./routes/authRoute";
import projectRouter from "./routes/projectRoutes";
import tagRouter from "./routes/tagRoutes";
import ticketRouter from "./routes/ticketRoutes"
import cors from "cors";

const app = express();
const port: any = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());
app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/tags", tagRouter);
app.use("/tickets", ticketRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
