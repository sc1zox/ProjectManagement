import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import ProjectController from '../controllers/project.controller';
import TeamController from "../controllers/team.controller";

const userRouter = Router();

userRouter.route('/users').get(rescue(userController.getAll));
userRouter.route('/users/:id').get(rescue(userController.getUserById));

userRouter.route('/projects').get(rescue(ProjectController.getProjects));
userRouter.route('/projects/:id').get(rescue(ProjectController.getProjectById));

userRouter.route('/teams').get(rescue(TeamController.getTeams));
userRouter.route('/teams/:id').get(rescue(TeamController.getTeamByID));

userRouter.post('/users/create', rescue(userController.createUser));
userRouter.post('/team/create', rescue(TeamController.createTeam));
userRouter.post('/project/create', rescue(ProjectController.createProject));
userRouter.put('/project/update', rescue(ProjectController.updateProject));

export default userRouter;
