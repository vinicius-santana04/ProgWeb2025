import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './router/router';
import { logMiddleware } from './middlewares/loggers';
import { engine } from 'express-handlebars';
import { validateEnv } from './utils/validateEnv';

dotenv.config();
validateEnv();

const PORT = process.env.PORT || 3333;
const app = express();

app.use(logMiddleware('completo'));
app.use(express.static('src/public'))
app.use(express.urlencoded({extended: false}));
app.use(router);

app.engine("handlebars", engine({
  helpers: require(`${__dirname}/views/helpers/helpers.ts`),
  layoutsDir: `${__dirname}/views/layouts`,
  defaultLayout: 'main',
}));

app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.listen(PORT, () => {
  console.log(`Express app iniciada. Acesse: http://localhost:${PORT}`);
});

declare module 'express-session' {
 interface SessionData {
 uid: string;
 }
}