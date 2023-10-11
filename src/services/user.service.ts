import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUniqueUser = async (email: string, password: string) => {
    // we will check the email and passwork in the database if the user exists return yes
    // if not return no
    
    const user = await prisma.user.findUnique({
        where: {
            email: email,
            password: password,
        },
    });
    return user;
};