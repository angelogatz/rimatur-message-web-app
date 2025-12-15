// server/src/routes/userRoutes.js
import express from 'express';
import { createUser, loginUser, getAllUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', authMiddleware, getAllUsers);

export default router;