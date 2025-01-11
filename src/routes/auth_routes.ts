import express from 'express';
import AuthController from '../controllers/auth_controllers';

const router = express.Router();

router.post("/register", AuthController.Register);

router.post("/login", AuthController.Login);

router.post("/logout", AuthController.Logout);

router.post("/refresh", AuthController.Refresh);

export default router;
