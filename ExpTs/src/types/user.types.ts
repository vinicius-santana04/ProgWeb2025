import { User } from '@prisma/client';

type BaseUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password'>;

export interface UserCreateData extends BaseUserData {
    password: string;
    passwordConfirmation: string; 
}

export type UserUpdateData = Partial<Omit<UserCreateData, 'password' | 'passwordConfirmation'>>;

export type LoginDto = Pick<User, 'email' | 'password'>;