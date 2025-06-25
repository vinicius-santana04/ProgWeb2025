import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const renderLoginForm = (req: Request, res: Response) => {
    res.render('users/login');
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        const ok = user && (await bcrypt.compare(password, user.password));

        if (ok) {
            req.session.logado = true;
            req.session.userId = user.id;
            res.redirect("/lobby");
        } else {
            res.status(401).render('users/login', { error: 'Email ou senha inválidos.' });
        }
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).render('users/login', { error: 'Ocorreu um erro interno.' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return console.error("Erro ao fazer logout:", err);
        }
        res.clearCookie("connect.sid");
        res.redirect('/lobby');
    });
};