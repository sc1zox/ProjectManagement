import { Router } from 'express';
import rescue from 'express-rescue'; 
import authController from '../controllers/auth.controller';

const authRouter = Router();


authRouter.route('/login').post(rescue(authController.authenticate));

authRouter.get('/verify-token', rescue(authController.verify));

export default authRouter;
