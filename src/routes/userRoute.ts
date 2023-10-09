import express, {Request, Response} from "express";
import {User} from "../models/userModel";

export const userRouter = express.Router();

userRouter.get("/user/test", (req: Request, res: Response) => {
  res.send("Testing");
});

userRouter.post("/user/register", async (req: Request, res: Response) => {
  const newUser = new User(req.body);

  const existingUser = await User.findOne({ email: newUser.email });
  if (existingUser) {
    res.send({
      status: 409,
      message: "Email already registered",
    });
    return;
  }

  User.create(newUser);
  res.send({
    status: 200,
    message: "User created",
  })

});

userRouter.post("/user/login", (req: Request, res: Response) => {

});
