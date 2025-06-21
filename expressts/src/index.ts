import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const PORT = process.env.PORT || 3333;
const app = express();

const user = {
    checkAuth: (req: Request): boolean => {
        const token = req.headers['authorization'];
        if (token && token === 'Bearer meu-token-secreto') {
            return true;
        }
        return false;
    }
};

app.use(morgan('short'));
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Requisição ${req.method} ${req.url}`);
    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    if (user.checkAuth(req)) {
        next();
    } else {
        res.status(403).json({ msg: "Usuário não autenticado" });
    }
});

app.get('/dados-secretos', (req: Request, res: Response) => {
    res.json({ dados_secretos: { codigo: 156234 } });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.post("/", (req: Request, res: Response) => {
    console.log("Requisição POST no /");
    res.send("Requisição POST recebida!");
});

// MODIFICAÇÃO AQUI
app.listen(PORT, () => {
  // Adicionamos a URL completa para gerar o link
  console.log(`Express app iniciada. Acesse: http://localhost:${PORT}`);
});