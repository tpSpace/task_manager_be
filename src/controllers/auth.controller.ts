import { findUniqueUser } from "../services/user.service";
import { Request, Response } from 'express';

export const loginUserHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await findUniqueUser(email, password);
        if (user) {
            return res.status(200).json({
                status: 'success',
                data: user,
            });
        } 
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
    }
};