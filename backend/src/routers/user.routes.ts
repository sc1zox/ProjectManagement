import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth';

const userRouter = Router();

userRouter.route('/users').get(rescue(userController.getAll));
userRouter.route('/users/:id').get(rescue(userController.getUserById));

userRouter.route('/projects').get(rescue(userController.getProjects));
userRouter.route('/projects/:id').get(rescue(userController.getProjectById));

userRouter.route('/teams').get(rescue(userController.getTeams));
userRouter.route('/teams/:id').get(rescue(userController.getTeamByID));

userRouter.post('/users/create', rescue(userController.create));

export default userRouter;
