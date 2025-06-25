// Arquivo src/controllers/main.ts
import { Request, Response } from 'express';
import { loremIpsum } from 'lorem-ipsum';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const index = async (req: Request, res: Response) => {
  if (req.session.logado && req.session.userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.session.userId }
      });

      res.render('game/game', { layout: 'gameLayout', user: user });
      
    } catch (error) {
      res.status(500).send("Ocorreu um erro ao carregar os dados.");
    }
  } else {
    res.render('main/home');
  }
};

const lorem = (req: Request, res: Response) => {
  const paragraphCount = parseInt(req.params.count, 10) || 1;

  const loremText = loremIpsum({
    count: paragraphCount, 
    units: 'paragraphs', 
    format: 'html',
  });

  res.render('main/lorem', {
    pageTitle: 'Gerador de Lorem Ipsum',
    loremText: loremText 
  });
};

const about = (req: Request, res: Response) => {
  const pageData = {
    title: 'Sobre o Gênero Space Shooter',
    paragraphs: [
      'Space Shooter é um dos gêneros mais clássicos e duradouros dos videogames. Nele, o jogador normalmente controla uma nave espacial em um cenário de rolagem (vertical ou horizontal) e tem como objetivo destruir ondas de naves inimigas, asteroides e outros perigos cósmicos. O gênero exige reflexos rápidos, precisão e gerenciamento de power-ups para sobreviver a desafios cada vez maiores.',
      'Desde os primórdios com jogos como Space Invaders e Galaga, o gênero evoluiu, incorporando gráficos complexos, sistemas de upgrade profundos e narrativas envolventes. Mesmo com o avanço da tecnologia, a jogabilidade central de "atirar e desviar" continua a cativar milhões de jogadores em todo o mundo, provando seu apelo atemporal.'
    ],
    images: [
      { src: '/assets/png/player.png', alt: 'Nave espacial' }
    ]
  };
  res.render('main/about', pageData);
};

const hb1 = (req: Request, res: Response) => {
  res.render('main/hb1', {
    mensagem: 'Universidade Federal do Amazonas',
    //layout: false,
  });
};

const hb2 = (req: Request, res: Response) => {
  res.render('main/hb2', {
    poweredByNodejs: true,
    name: 'Express',
    type: 'Framework',
    //layout: false,
  });
};

const hb3 = (req: Request, res: Response) => {
  const profes = [
    { nome: 'David Fernandes', sala: 1238 },
    { nome: 'Horácio Fernandes', sala: 1233 },
    { nome: 'Edleno Moura', sala: 1236 },
    { nome: 'Elaine Harada', sala: 1231 }
  ];
  res.render('main/hb3', { profes });
};

const hb4 = (req: Request, res: Response) => {
  const technologies = [
    { name: 'Express', type: 'Framework', poweredByNodejs: true },
    { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
    { name: 'React', type: 'Library', poweredByNodejs: true },
    { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
    { name: 'Django', type: 'Framework', poweredByNodejs: false },
    { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
    { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
  ];
  res.render('main/hb4', { technologies });
};

const cookie = (req: Request, res: Response) => {
  if (!('nomeCookie' in req.cookies)) {
    res.cookie('nomeCookie', 'valorCookie');
    res.send('Você NUNCA passou por aqui!');
  } else {
    res.send('Você JÁ passou por aqui');
  }
}

const ranking = async (req: Request, res: Response) => {
    try {
      const topUsers = await prisma.user.findMany({
        orderBy: {
          highScore: 'desc',
        },
        take: 10,
        select: {
          name: true,
          highScore: true,
        },
      });

      res.render('main/ranking', { users: topUsers });
    } catch (error) {
      console.error("Erro ao buscar o ranking:", error);
      res.status(500).send("Não foi possível carregar o ranking.");
    }
}

const renderLobby = async (req: Request, res: Response) => {
  res.render('main/lobby');
}

export default { index, lorem, about, hb1, hb2, hb3, hb4, cookie, ranking, renderLobby};