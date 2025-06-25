import { cleanEnv, num, port, str } from 'envalid';

export const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: port(),
        SECRET_SESSION: str(),
        ROUNDS_BCRYPT: num()
    });
};
export default validateEnv;