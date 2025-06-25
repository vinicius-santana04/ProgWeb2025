import { Router } from 'express';
import mainController from '../controllers/main.controllers';
import majorController from '../controllers/major.controllers';
import * as userController from '../controllers/user.controllers';

const router = Router();

// MainController
router.get('/', mainController.index);
router.get('/lorem/:count', mainController.lorem);
router.get('/about', mainController.about);
router.get('/hb1', mainController.hb1);
router.get('/hb2', mainController.hb2);
router.get('/hb3', mainController.hb3);
router.get('/hb4', mainController.hb4);


// MajorController
router.get('/major', majorController.index)
router.all('/major/create', majorController.create)
router.get('/major/read/:id', majorController.read)
router.all('/major/update/:id', majorController.update)
router.post('/major/remove/:id', majorController.remove)

// UserController
router.get('/users/create', userController.renderCreateUserForm);
router.post('/users/create', userController.createUserController);

export default router;
