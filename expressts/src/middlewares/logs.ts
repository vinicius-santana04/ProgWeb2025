import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

type LogFormat = 'simples' | 'completo';

export function logMiddleware(format: LogFormat) {
  return (req: Request, res: Response, next: NextFunction) => {
    const logFolder = process.env.LOG_FOLDER || 'logs';
    const logPath = path.join(logFolder, 'access.log');

    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder, { recursive: true });
    }

    const now = new Date().toISOString();
    const basicInfo = `[${now}] ${req.method} ${req.url}`;
    let logLine = '';

    if (format === 'simples') {
      logLine = basicInfo;
    } else if (format === 'completo') {
      const httpVersion = `HTTP/${req.httpVersion}`;
      const userAgent = req.get('User-Agent') || '';
      logLine = `${basicInfo} ${httpVersion} "${userAgent}"`;
    }

    fs.appendFileSync(logPath, logLine + '\n');
    next();
  };
}