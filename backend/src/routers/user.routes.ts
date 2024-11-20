import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import ProjectController from '../controllers/project.controller';
import TeamController from "../controllers/team.controller";
import RoadmapController from "../controllers/roadmap.controller";
import SkillsController from "../controllers/skills.controller";
import UserController from "../controllers/user.controller";
import NotificationsController from "../controllers/notifications.controller";

const userRouter = Router();


userRouter.get('/users', rescue(userController.getAllUser));
userRouter.get('/users/:id', rescue(userController.getUserById));
userRouter.post('/users/create', rescue(userController.createUser));
userRouter.put('/users/update/arbeitszeit', rescue(UserController.updateArbeitszeit));

userRouter.get('/projects', rescue(ProjectController.getProjects));
userRouter.get('/projects/:id', rescue(ProjectController.getProjectById));
userRouter.post('/project/delete/:id', rescue(ProjectController.deleteProject));
userRouter.get('/team/projects/:id', rescue(ProjectController.getProjectsByTeam));
userRouter.post('/project/create', rescue(ProjectController.createProject));
userRouter.put('/project/update', rescue(ProjectController.updateProject));
userRouter.get('/project/current/:id',rescue(ProjectController.getProjectWithLowestPriorityByUserId));

userRouter.get('/team', rescue(TeamController.getTeams));
userRouter.get('/team/:id', rescue(TeamController.getTeamByID));
userRouter.post('/team/create', rescue(TeamController.createTeam));
userRouter.get('/team/user/:id',rescue(TeamController.getTeamByUserID));
userRouter.post('/team/user/delete', rescue(TeamController.removeUserFromTeam));
userRouter.post('/team/user/add', rescue(TeamController.addUserToTeam));

userRouter.get('/roadmaps', rescue(RoadmapController.getAllRoadmaps));
userRouter.get('/roadmaps/:id',rescue(RoadmapController.getRoadmapById));
userRouter.put('/roadmaps/update',rescue(RoadmapController.updateProjectsPriority));

userRouter.post('/skills/add',rescue(SkillsController.addOrCreateSkillToUser));
userRouter.get('/skills/:id', rescue(SkillsController.getUserSkills));
userRouter.post('/skills/remove', rescue(SkillsController.removeSkillFromUser));

userRouter.get('/notifications/:id', rescue(NotificationsController.getNotificationsByUserId));
userRouter.post('/notifications', rescue(NotificationsController.setNotification));
userRouter.post('/notifications/read/:id', rescue(NotificationsController.markNotificationAsRead));
userRouter.post('/notifications/delete/:id', rescue(NotificationsController.deleteNotification));
userRouter.post('/notifications/create', rescue(NotificationsController.createNotification));

export default userRouter;
