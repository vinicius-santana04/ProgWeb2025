import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveGameSession = async (req: Request, res: Response) => {
  try {
    const { score, duration } = req.body;
    const userId = req.session.userId;

    if (typeof score !== 'number' || typeof duration !== 'number' || !userId) {
      res.status(400).json({ error: 'Dados inválidos ou usuário não autenticado.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    await prisma.gameSession.create({
      data: {
        score: score,
        duration: duration,
        userId: userId,
      },
    });

    if (score > user.highScore) {
      await prisma.user.update({
        where: { id: userId },
        data: { highScore: score },
      });
    }

    res.status(201).json({ message: 'Sessão de jogo salva com sucesso!' });

  } catch (error) {
    console.error("Erro ao salvar a sessão de jogo:", error);
    res.status(500).json({ error: 'Erro interno ao salvar o score.' });
  }
};