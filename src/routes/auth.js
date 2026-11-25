import express from 'express';
import * as authorization from '../middleware/authorization.js';
import { registerUser, loginUser, getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authorization.byPassword, getUser);

export default router;
