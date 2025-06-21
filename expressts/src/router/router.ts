import { Router, Request, Response } from 'express';
import { loremIpsum } from 'lorem-ipsum';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/lorem/:count', (req: Request, res: Response) => {
  const paragraphCount = parseInt(req.params.count, 10);

  const loremText = loremIpsum({
    count: paragraphCount, 
    units: 'paragraphs', 
    format: 'html',
  });

  res.send(loremText);
});

export default router;