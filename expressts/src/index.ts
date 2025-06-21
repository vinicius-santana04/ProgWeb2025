import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validadeEnv';

import { logMiddleware } from './middlewares/logs';

dotenv.config();
const PORT = process.env.PORT || 3333;

// Middleware de log (troque entre 'simples' e 'completo')
app.use(logMiddleware('completo'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// MODIFICAÇÃO AQUI
app.listen(PORT, () => {
  // Adicionamos a URL completa para gerar o link
  console.log(`Express app iniciada. Acesse: http://localhost:${PORT}`);
});
