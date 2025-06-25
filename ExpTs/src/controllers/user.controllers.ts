import { Request, Response } from 'express';
import {
    createUser,
} from '../services/user.service';
import { UserCreateData } from '../types/user.types';

export const renderCreateUserForm = (req: Request, res: Response): void => {
    res.render('users/create');
};

export const createUserController = async (req: Request, res: Response): Promise<void> => {
    const userData: UserCreateData = req.body;

    if (userData.password !== userData.passwordConfirmation) {
        res.status(400).render('users/create', {
            error: 'As senhas não coincidem.',
            name: userData.name,
            email: userData.email,
        });
        return;
    }

    try {
        await createUser(userData);
        
        res.redirect('/major');

    } catch (error: any) {
        console.error('Error creating user:', error);

        let errorMessage = 'Ocorreu um erro ao criar o usuário.';
        
        if (error.code === 'P2002') {
            errorMessage = 'O email fornecido já está cadastrado.';
        }

        res.status(500).render('users/create', {
            error: errorMessage,
            name: userData.name,
            email: userData.email,
        });
    }
};
