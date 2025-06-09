import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validadeEnv';

import { logMiddleware } from './middlewares/logs';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware de log (troque entre 'simples' e 'completo')
app.use(logMiddleware('completo'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Express app iniciada na porta ${PORT}.`);
});
