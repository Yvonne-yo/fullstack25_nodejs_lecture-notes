import express from 'express';
import {
  validateCredentials,
  validateNewUser,
} from '../middleware/validation.js';
import {
  registerController,
  logInController,
} from '../controllers/authControllers.js';

const router = express.Router();

router.post(
  '/register',
  validateCredentials,
  validateNewUser,
  registerController
);

router.post('/login', validateCredentials, logInController);

export default router;
