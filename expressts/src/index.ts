import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './router/router';
import { logMiddleware } from './middlewares/logs';

dotenv.config();
const PORT = process.env.PORT || 3333;
const app = express();
app.use(router);

// Middleware de log (troque entre 'simples' e 'completo')
app.use(logMiddleware('completo'));

app.listen(PORT, () => {
  console.log(`Express app iniciada. Acesse: http://localhost:${PORT}`);
});
