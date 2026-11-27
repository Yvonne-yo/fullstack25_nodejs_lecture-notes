import express from 'express';
import * as auth from '../middleware/authentication.js';
import { authorize } from '../middleware/authorization.js';
import {
  validateCredentials,
  validateNewUser,
} from '../middleware/validation.js';
import {
  registerController,
  logInController,
} from '../controllers/authControllers.js';
import { registerUser, loginUser, getUser, getAllUsers, updateUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', auth.byPassword, getUser);

router.get('/users', auth.byPassword, authorize('readAll'), getAllUsers);
router.post('/update/:id', auth.byPassword, authorize('update'), updateUser);

//Saras alternativa lösning
/*router.post(
  '/register',
  validateCredentials,
  validateNewUser,
  registerController
);

router.post('/login', validateCredentials, logInController);
*/
export default router;
