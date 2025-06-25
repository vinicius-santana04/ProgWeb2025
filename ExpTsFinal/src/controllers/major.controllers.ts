import { Request, Response } from 'express';
import { createMajorSchema, updateMajorSchema } from '../validators/major.validator';
import { 
    getAllMajors, 
    getMajorByCode, 
    getMajorById, 
    createMajor, 
    updateMajor, 
    deleteMajor, 
    countUsersInMajor 
} from '../services/major.service';

export const index = async (req: Request, res: Response) => {
    try {
        const majors = await getAllMajors();
        res.render('major/index', { majors });
    } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        res.status(500).send("Erro ao carregar a lista de cursos.");
    }
};

export const create = async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        return res.render('major/create');
    }

    try {
        const { error, value } = createMajorSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join('. ');
            return res.status(400).render('major/create', {
                error: errorMessages,
                name: req.body.name, code: req.body.code, description: req.body.description,
            });
        }

        const { name, code, description } = value;
        const existingMajor = await getMajorByCode(code);
        if (existingMajor) {
            return res.status(409).render('major/create', {
                error: `O código "${code}" já está em uso.`,
                name, code, description,
            });
        }
        
        await createMajor({ name, code, description });
        res.redirect('/major');

    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).render('major/create', { error: "Ocorreu um erro ao criar o curso." });
    }
};

export const read = async (req: Request, res: Response) => {
    try {
        const major = await getMajorById(req.params.id);
        if (!major) throw new Error("Curso não encontrado");
        res.render('major/detail', { major });
    } catch (err) {
        console.error("Erro ao buscar detalhes do curso:", err);
        res.status(404).send("Curso não encontrado.");
    }
};

export const renderUpdateForm = async (req: Request, res: Response) => {
    try {
        const major = await getMajorById(req.params.id);
        if (!major) throw new Error("Curso não encontrado");
        res.render('major/update', { major });
    } catch (error) {
        console.error("Erro ao carregar formulário de edição de curso:", error);
        res.status(404).send("Curso não encontrado.");
    }
};

export const update = async (req: Request, res: Response) => {
    const majorId = req.params.id;
    try {
        const { error, value } = updateMajorSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join('. ');
            const major = await getMajorById(majorId);
            return res.status(400).render('major/update', { error: errorMessages, major });
        }

        const { name, code, description } = value;
        if (code) {
            const existingMajor = await getMajorByCode(code);
            if (existingMajor && existingMajor.id !== majorId) {
                const major = await getMajorById(majorId);
                return res.status(409).render('major/update', {
                    error: `O código "${code}" já está em uso por outro curso.`,
                    major,
                });
            }
        }
        
        await updateMajor(majorId, { name, code, description });
        res.redirect('/major');

    } catch (error) {
        console.error("Erro ao atualizar curso:", error);
        const major = await getMajorById(majorId);
        res.status(400).render('major/update', { error: "Não foi possível atualizar o curso.", major });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const majorId = req.params.id;
        const userCount = await countUsersInMajor(majorId);

        if (userCount > 0) {
            res.status(409).json({ 
                message: `Não é possível excluir este curso, pois ${userCount} usuário(s) estão matriculados nele.` 
            });
            return;
        }

        await deleteMajor(majorId);
        res.status(200).json({ message: "Curso excluído com sucesso." });

    } catch (error) {
        console.error("Erro ao remover curso:", error);
        res.status(500).json({ message: "Ocorreu um erro interno ao tentar remover o curso." });
    }
};