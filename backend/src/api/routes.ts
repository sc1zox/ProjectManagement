import { Router } from 'express';
import authRouter from '../routers/auth.routers';
import userRouter from '../routers/user.routes';

const router = Router();


router.use('/auth', authRouter);
router.use('/api/users', userRouter);


export default router;
