import { Router } from 'express';
import mainController from '../controllers/main.controllers';
import * as majorController from '../controllers/major.controllers';
import * as userController from '../controllers/user.controllers';
import * as authController from '../controllers/auth.controllers';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { saveGameSession } from '../controllers/game.controllers';
const router = Router();

// MainController
router.get('/', mainController.index);
router.get('/lorem/:count', mainController.lorem);
router.get('/about', mainController.about);
router.get('/hb1', mainController.hb1);
router.get('/hb2', mainController.hb2);
router.get('/hb3', mainController.hb3);
router.get('/hb4', mainController.hb4);
router.get('/cookie', mainController.cookie);

// UserController
router.get('/users/create', userController.renderCreateUserForm);
router.post('/users/create', userController.createUserController);
router.get('/login', authController.renderLoginForm);
router.post('/login', authController.loginUser);

// Privado

// Auth
router.get('/lobby', checkAuth, mainController.renderLobby);
router.post('/logout', checkAuth, authController.logoutUser);

// Game Controller
router.post('/game/save', checkAuth, saveGameSession);
router.get('/ranking', checkAuth, mainController.ranking);

// Major Controller
router.get('/major', checkAuth, majorController.index);
router.all('/major/create', checkAuth, majorController.create);
router.get('/major/read/:id', checkAuth, majorController.read);
router.get('/major/update/:id', checkAuth, majorController.renderUpdateForm);
router.post('/major/update/:id', checkAuth, majorController.update)
router.post('/major/remove/:id', checkAuth, majorController.remove);

// User Controller
router.get('/users', checkAuth, userController.listAllUsers)
router.get('/users/read/:id', checkAuth, userController.renderUserDetails);

router.get('/users/update/:id', checkAuth, userController.renderUpdateForm);
router.post('/users/update/:id', checkAuth, userController.updateUser);

router.get('/users/profile', checkAuth, userController.renderProfileForm);
router.post('/users/profile', checkAuth, userController.updateProfile);

router.get('/users/password', checkAuth, userController.renderPasswordForm);
router.post('/users/password', checkAuth, userController.updatePassword);

router.post('/users/remove/:id', checkAuth, userController.removeUser);


// Rota admin 

/**
    router.get('/major', checkAuth, checkAdmin, majorController.index);
    router.all('/major/create', checkAuth, checkAdmin, majorController.create);
    router.get('/major/read/:id', checkAuth, checkAdmin, majorController.read);
    router.all('/major/update/:id', checkAuth, checkAdmin, majorController.update);
    router.post('/major/remove/:id', checkAuth, checkAdmin, majorController.remove);
    router.get('/users', checkAuth, checkAdmin, userController.listAllUsers)
    router.get('/users/read/:id', checkAuth, checkAdmin, userController.renderUserDetails);
    router.post('/users/remove/:id', checkAuth, checkAdmin, userController.removeUser);
 */

export default router;

