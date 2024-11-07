import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth'; // Importing authentication middleware

const userRouter = Router();

userRouter.route('/').get(authMiddleware, rescue(userController.getAll));


userRouter.route('/:id').get(authMiddleware, rescue(userController.getById));

export default userRouter;
