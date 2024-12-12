import { Router } from 'express';
import rescue from 'express-rescue';
import userController from '../controllers/user.controller';
import ProjectController from '../controllers/project.controller';
import TeamController from "../controllers/team.controller";
import RoadmapController from "../controllers/roadmap.controller";
import SkillsController from "../controllers/skills.controller";
import UserController from "../controllers/user.controller";
import NotificationsController from "../controllers/notifications.controller";
import checkRole from '../middleware/roleChecker';
import {UserRole} from "@prisma/client";
import PdfController from "../controllers/pdf.controller";
import isAuthenticated from "../middleware/checkToken";

const userRouter = Router();

userRouter.get('/users', rescue(userController.getAllUser));
userRouter.get('/users/:id', rescue(userController.getUserById));
userRouter.post('/users/create', checkRole([UserRole.Admin], rescue(userController.createUser)));
userRouter.delete('/users/delete/:id', rescue(userController.deleteUser));
userRouter.put('/users/update/arbeitszeit', isAuthenticated,rescue(UserController.updateArbeitszeit));
userRouter.put('/users/update/urlaubstage', isAuthenticated,rescue(UserController.updateUrlaubstage));
userRouter.get('/users/estimations/:id', rescue(UserController.getEstimationsByUserId));
userRouter.get('/users/vacations/:id', rescue(UserController.getUserVacationsById));
userRouter.post('/users/vacations/set',isAuthenticated,rescue(UserController.addVacation));
userRouter.delete('/users/vacations/delete/:id', isAuthenticated,rescue(UserController.deleteVacation));
userRouter.put('/users/vacations/update-state', isAuthenticated,rescue(UserController.updateVacationStatus))

userRouter.get('/projects', rescue(ProjectController.getProjects));
userRouter.get('/projects/:id', rescue(ProjectController.getProjectById));
userRouter.delete('/project/delete/:id', checkRole([UserRole.PO,UserRole.Bereichsleiter],rescue(ProjectController.deleteProject)));
userRouter.get('/team/projects/:id', rescue(ProjectController.getProjectsByTeam));
userRouter.post('/project/create', checkRole([UserRole.PO,UserRole.Bereichsleiter],rescue(ProjectController.createProject)));
userRouter.put('/project/update', isAuthenticated,rescue(ProjectController.updateProject));
userRouter.get('/project/current/:id', rescue(ProjectController.getProjectWithLowestPriorityByUserId));
userRouter.post('/project/create/estimation', checkRole([UserRole.Developer],rescue(ProjectController.addEstimationToProject)));
userRouter.get('/project/estimation/:id', rescue(ProjectController.getEstimationsWithAverage));
userRouter.put('/project/status/update', checkRole([UserRole.PO,UserRole.Bereichsleiter,UserRole.SM],rescue(ProjectController.updateProjectStatus)));

userRouter.get('/team', rescue(TeamController.getTeams));
userRouter.get('/team/:id', rescue(TeamController.getTeamByID));
userRouter.post('/team/create', checkRole([UserRole.Admin,UserRole.Bereichsleiter],rescue(TeamController.createTeam)));
userRouter.get('/team/user/:id', rescue(TeamController.getTeamByUserID));
userRouter.post('/team/user/delete', checkRole([UserRole.Admin],rescue(TeamController.removeUserFromTeam)));
userRouter.post('/team/user/add', checkRole([UserRole.SM],rescue(TeamController.addUserToTeam)));
userRouter.delete('/team/delete/:id', checkRole([UserRole.Admin], rescue(TeamController.deleteTeam)));

userRouter.get('/roadmaps', rescue(RoadmapController.getAllRoadmaps));
userRouter.get('/roadmaps/:id', rescue(RoadmapController.getRoadmapById));
userRouter.put('/roadmaps/update', isAuthenticated,rescue(RoadmapController.updateProjectsPriority));

userRouter.post('/skills/add', isAuthenticated,rescue(SkillsController.addOrCreateSkillToUser));
userRouter.get('/skills/:id', rescue(SkillsController.getUserSkills));
userRouter.post('/skills/remove', isAuthenticated,rescue(SkillsController.removeSkillFromUser));

userRouter.get('/notifications/:id', rescue(NotificationsController.getNotificationsByUserId));
userRouter.post('/notifications', isAuthenticated,rescue(NotificationsController.setNotification));
userRouter.put('/notifications/read/:id', isAuthenticated,rescue(NotificationsController.markNotificationAsRead));
userRouter.delete('/notifications/delete/:id', isAuthenticated,rescue(NotificationsController.deleteNotification));
userRouter.post('/notifications/create', isAuthenticated,rescue(NotificationsController.createNotification));

userRouter.get('/export/:id', rescue(PdfController.exportUserPDF));

export default userRouter;