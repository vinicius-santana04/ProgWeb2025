import { Request, Response } from 'express'
import { 
    createMajor, 
    getAllMajors, 
    getMajorById, 
    updateMajor, 
    deleteMajor 
} from '../services/major.service';

const index = async (req: Request, res: Response) => {
    try {
        const majors = await getAllMajors();
        res.render('major/index', { majors });
    } catch (err) {
        res.status(500).send(err);
    }
};
const create = async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        res.render('major/create')
        } else {
        try {
            await createMajor(req.body)
            res.redirect('/major')
        }   catch (err) {
            res.status(500).send(err)
        }
    }
}

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const major = await getMajorById(id);
        res.render('major/detail', { major });
    } catch (err) {
        res.status(500).send(err);
    }
};

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (req.method === 'GET') {
        try {
            const major = await getMajorById(id);
            res.render('major/update', { major });
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        try {
            await updateMajor(id, req.body);
            res.redirect('/major');
        } catch (err) {
            res.status(500).send(err);
        }
    }
};
const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteMajor(id);
        res.redirect('/major');
    } catch (err) {
        res.status(500).send(err);
    }
};

export default { index, create, read, update, remove }