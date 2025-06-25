import { NextFunction, Request, Response } from "express";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (user && user.role === 'ADMIN') {
        return next();
    } else {
        console.log("Acesso negado: Usuário não é admin.");
        return res.redirect('/lobby'); 
    }
};
