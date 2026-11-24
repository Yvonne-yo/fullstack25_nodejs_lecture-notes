import express from 'express';
import { userPassword } from '../middleware/authorization.js';
import { registerUser, loginUser, getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', userPassword, getUser);

export default router;
