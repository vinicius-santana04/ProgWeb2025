import { Request } from 'express';

const checkAuth = (req: Request): boolean => {
  const token = req.headers['authorization'];
  if (token && token === 'meu-token-secreto-123') {
    return true;
  }
  return false;
};

export default { checkAuth };