import express from 'express';
import * as authorization from '../middleware/authorization.js';
import {
  validateCredentials,
  validateNewUser,
} from '../middleware/validation.js';
import {
  registerController,
  logInController,
} from '../controllers/authControllers.js';
import { registerUser, loginUser, getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authorization.byPassword, getUser);

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
