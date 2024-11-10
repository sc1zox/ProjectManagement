import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import ProjectController from '../controllers/project.controller';
import TeamController from "../controllers/team.controller";
import RoadmapController from "../controllers/roadmap.controller";

const userRouter = Router();


userRouter.get('/users', rescue(userController.getAll));
userRouter.get('/users/:id', rescue(userController.getUserById));
userRouter.post('/users/create', rescue(userController.createUser));


userRouter.get('/projects', rescue(ProjectController.getProjects));
userRouter.get('/projects/:id', rescue(ProjectController.getProjectById));
userRouter.get('/team/projects/:id', rescue(ProjectController.getProjectsByTeam));
userRouter.post('/project/create', rescue(ProjectController.createProject));
userRouter.put('/project/update', rescue(ProjectController.updateProject));


userRouter.get('/team', rescue(TeamController.getTeams));
userRouter.get('/team/:id', rescue(TeamController.getTeamByID));
userRouter.post('/team/create', rescue(TeamController.createTeam));
userRouter.get('/team/user/:id',rescue(TeamController.getTeamByUserID))


userRouter.get('/roadmaps', rescue(RoadmapController.getAllRoadmaps));

export default userRouter;
