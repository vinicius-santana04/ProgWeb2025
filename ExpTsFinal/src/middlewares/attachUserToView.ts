import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const attachUserToView = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = null;
    res.locals.isAuthenticated = false;

    if (req.session.userId) {
        try {
            const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
            if (user) {
                const { password, ...userWithoutPassword } = user;
                res.locals.user = userWithoutPassword;
                res.locals.isAuthenticated = true;
            }
        } catch (error) {
            console.error("Erro ao buscar usuário da sessão:", error);
        }
    }
    next();
};
