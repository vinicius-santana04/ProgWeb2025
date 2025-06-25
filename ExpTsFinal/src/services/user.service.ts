// Arquivo src/services/user.ts
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs';
import { UserCreateData  } from '../types/user.types'

const prisma = new PrismaClient();

export const createUser = async (user: UserCreateData): Promise<User> => {
    const { passwordConfirmation, ...userData } = user;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    return await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
    });
};