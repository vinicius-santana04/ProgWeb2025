import { NextFunction, Request, Response } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.logado === true) {
        return next();
    } else {
        return res.redirect('/');
    }
};