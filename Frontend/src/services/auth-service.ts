
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../models/user-model";
import { appConfig } from "../utils/app-config";
import { CredentialsModel } from "../models/credentials-model";

class AuthService {

    // Register a new user and store the received JWT.
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.registerUrl, user);
        localStorage.setItem("token", response.data);
    }

    // Log in with credentials and store the received JWT.
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        localStorage.setItem("token", response.data);
    }

    // Remove the JWT from local storage.
    public logout(): void {
        localStorage.removeItem("token");
    }

    // Decode the JWT to retrieve the logged-in user's information.
    public getUser(): UserModel | null {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = jwtDecode<{ user: UserModel }>(token);
        return payload.user;
    }

    // Check whether a JWT exists in local storage.
    public isLoggedIn(): boolean {
        return localStorage.getItem("token") !== null;
    }

}

export const authService = new AuthService();
