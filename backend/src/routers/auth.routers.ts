import { Router } from 'express';
import rescue from 'express-rescue'; // A simple error.ts handling middleware
import authController from '../controllers/auth.controller'; // Import the auth controller

const authRouter = Router();

// POST route for logging in the user
authRouter.route('/login').post(rescue(authController.authenticate));

export default authRouter;
