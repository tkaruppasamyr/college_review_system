import { Router } from "express";
import AuthController from "./controller";
import { authenticateToken } from "./authhandler";

export const authRouters = Router();

authRouters.post('/register',authenticateToken,AuthController.register);
authRouters.post('/login',AuthController.login);