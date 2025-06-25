import { PrismaClient, User } from '@prisma/client';
import bcrypt, { compare } from 'bcryptjs';
import { LoginDto } from '../types/user.types';
import { email } from 'envalid';

const prisma = new PrismaClient();

export const checkAuth = async (
  credentials: LoginDto
): Promise<Omit<User, 'password'> | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
    
  } catch (error) {
    console.error("Error during authentication check:", error);
    return null;
  }
};

export const checkCredentials = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        return await compare(password, user.password);
    }

    return false;
};