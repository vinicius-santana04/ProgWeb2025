import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUser} from '../services/user.service';
import { createUserSchema, updateProfileSchema, updatePasswordSchema } from '../validators/user.validator';
import { UserCreateData } from '../types/user.types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const renderCreateUserForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const majors = await prisma.major.findMany({
            orderBy: { name: 'asc' },
        });
        res.render('users/create', { majors });
    } catch (error) {
        console.error('ERRO AO BUSCAR CURSOS:', error);
        res.status(500).render('users/create', {
            error: 'Não foi possível carregar a lista de cursos.',
            majors: [],
        });
    }
};

export const createUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join('. ');
            const majors = await prisma.major.findMany({ orderBy: { name: 'asc' } });
            
            res.status(400).render('users/create', {
                error: errorMessages,
                name: req.body.name,
                email: req.body.email,
                majors,
            });
            return;
        }

        await createUser(value); 
        res.redirect('/login');

    } catch (error: any) {
        console.error('Error creating user:', error);
        const majors = await prisma.major.findMany({ orderBy: { name: 'asc' } });
        let errorMessage = 'Ocorreu um erro ao criar o usuário.';
        if (error.code === 'P2002') {
            errorMessage = 'O email fornecido já está cadastrado.';
        }
        res.status(400).render('users/create', { error: errorMessage, name: req.body.name, email: req.body.email, majors });
    }
};

export const listAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' },
            include: { major: true },
        });
        res.render('users/index', { users });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.render('users/index', {
            error: "Não foi possível carregar a lista de usuários.",
            users: [],
        });
    }
};

export const renderUpdateForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdToEdit = req.params.id;
        const [userToEdit, majors] = await Promise.all([
            prisma.user.findUniqueOrThrow({ where: { id: userIdToEdit } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        res.render('users/update', { userToEdit, majors });
    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.status(404).send("Usuário não encontrado");
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userIdToEdit = req.params.id;
    const { name, email, majorId, role } = req.body;

    try {
        await prisma.user.update({
            where: { id: userIdToEdit },
            data: {
                name,
                email,
                major: { connect: { id: majorId } },
                role: role,
            },
        });
        res.redirect(`/users/read/${userIdToEdit}`);
    } catch (error: any) {
        const [userToEdit, majors] = await Promise.all([
            prisma.user.findUnique({ where: { id: userIdToEdit } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        res.status(400).render('users/update', {
            error: "Erro ao atualizar usuário.",
            userToEdit,
            majors,
        });
    }
};

export const removeUser = async (req: Request, res: Response) => {
    try {
        const userIdToDelete = req.params.id;
        const loggedInUserId = req.session.userId;

        if (userIdToDelete === loggedInUserId) {
            res.status(403).send("Um administrador não pode excluir a própria conta.");
            return;
        }

        await prisma.gameSession.deleteMany({ where: { userId: userIdToDelete } });
        await prisma.user.delete({ where: { id: userIdToDelete } });

        res.status(200).send("Usuário excluído com sucesso.");
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
        res.status(500).send("Não foi possível remover o usuário.");
    }
};

export const renderUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: req.params.id },
            include: { major: true },
        });
        res.render('users/detail', { user });
    } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
        res.status(404).send("Usuário não encontrado");
    }
};

export const renderProfileForm = async (req: Request, res: Response) => {
    try {
        const [user, majors] = await Promise.all([
            prisma.user.findUniqueOrThrow({ where: { id: req.session.userId } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        res.render('users/profile', { user, majors });
    } catch (error) {
        res.status(404).send("Usuário não encontrado.");
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.session.userId!;
    
    const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(d => d.message).join('. ');
        const [user, majors] = await Promise.all([
            prisma.user.findUniqueOrThrow({ where: { id: userId } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        return res.status(400).render('users/profile', { user, majors, error: errorMessages });
    }

    const { name, email, currentPassword } = value;

    try {
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            const [user, majors] = await Promise.all([
                prisma.user.findUniqueOrThrow({ where: { id: userId } }),
                prisma.major.findMany({ orderBy: { name: 'asc' } }),
            ]);
            return res.status(401).render('users/profile', { user, majors, error: "Senha atual incorreta." });
        }

        const hasDataChanged = user.name !== name || user.email !== email;
        if (!hasDataChanged) {
            const [user, majors] = await Promise.all([
                prisma.user.findUniqueOrThrow({ where: { id: userId } }),
                prisma.major.findMany({ orderBy: { name: 'asc' } }),
            ]);
            return res.status(400).render('users/profile', { user, majors, error: "Nenhuma alteração foi detectada." });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        
        const [updatedUser, majors] = await Promise.all([
            prisma.user.findUniqueOrThrow({ where: { id: userId } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        res.render('users/profile', { user: updatedUser, majors, success: "Dados atualizados com sucesso!" });

    } catch (err: any) {
        let errorMessage = "Erro ao atualizar o perfil.";
        if (err.code === 'P2002') {
            errorMessage = "Este email já está em uso por outra conta.";
        }
        const [user, majors] = await Promise.all([
            prisma.user.findUniqueOrThrow({ where: { id: userId } }),
            prisma.major.findMany({ orderBy: { name: 'asc' } }),
        ]);
        res.status(400).render('users/profile', { user, majors, error: errorMessage });
    }
};

export const renderPasswordForm = (req: Request, res: Response) => {
    res.render('users/password');
};

export const updatePassword = async (req: Request, res: Response) => {
    const userId = req.session.userId!;

    const { error, value } = updatePasswordSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(d => d.message).join('. ');
        return res.status(400).render('users/password', { error: errorMessages });
    }

    const { currentPassword, newPassword } = value;

    try {
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).render('users/password', { error: "A senha atual está incorreta." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.render('users/password', { success: "Senha alterada com sucesso!" });

    } catch (err) {
        res.status(500).render('users/password', { error: "Ocorreu um erro ao alterar a senha." });
    }
};