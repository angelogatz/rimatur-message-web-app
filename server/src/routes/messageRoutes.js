import express from 'express';
import { sendMessage, getMessagesWithUser, markAsRead } from '../controllers/messageController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:otherUserId', authMiddleware, getMessagesWithUser);
router.patch('/read/:otherUserId', authMiddleware, markAsRead);

export default router;