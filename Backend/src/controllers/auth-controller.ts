
import express, { Request, Response, Router } from "express";
import { CredentialsModel } from "../models/credentials-model";
import { StatusCode } from "../models/enums";
import { UserModel } from "../models/user-model";
import { authService } from "../services/auth-service";

// Handles user registration and login requests:
class AuthController {

    // Create a router for authentication endpoints:
    public router: Router = express.Router();

    // Register authentication routes:
    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    // Register a new user:
    private async register(request: Request, response: Response): Promise<void> {
        const user = new UserModel(request.body);
        const token = await authService.register(user);
        response.status(StatusCode.Created).json(token);
    }

    // Login an existing user:
    private async login(request: Request, response: Response): Promise<void> {
        const credentials = new CredentialsModel(request.body);
        const token = await authService.login(credentials);
        response.json(token);
    }

}

export const authController = new AuthController();
