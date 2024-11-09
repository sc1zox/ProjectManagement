import { Router } from 'express';
import rescue from 'express-rescue'; 
import authController from '../controllers/auth.controller';

const authRouter = Router();


authRouter.route('/login').post(rescue(authController.authenticate));

authRouter.route('/create').post(rescue(authController.createLogin));

authRouter.get('/verify-token', rescue(authController.verify));

export default authRouter;
