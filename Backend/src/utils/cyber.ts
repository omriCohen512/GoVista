
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import { Role } from "../models/enums";
import crypto from "crypto";
import { UserModel } from "../models/user-model";

// Handles password hashing and JWT authentication:
class Cyber {

    // Hash a password using HMAC-SHA512 and the configured secret:
    public hash(plainText: string): string {
        const hashText = crypto.createHmac("sha512", appConfig.hashSalt).update(plainText).digest("hex");
        return hashText;
    }

    // Generate a JWT for the logged-in user:
    public generateToken(user: UserModel): string {

        // Remove the password before including user data in the token:
        user.password = undefined!;

        // Create a signed token that expires after three hours:
        const payload = { user };
        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, appConfig.jwtSecret!, options);

        return token;
    }

    // Verify the JWT signature and expiration:
    public verifyToken(token: string): boolean {

        try {
            if (!token) {
                return false;
            }

            jwt.verify(token, appConfig.jwtSecret!);
            return true;
        }
        catch (err: any) {
            return false;
        }
    }

    // Verify that the token belongs to an admin:
    public verifyAdmin(token: string): boolean {

        try {
            if (!token) {
                return false;
            }

            // Verify the JWT before checking the user's role:
            jwt.verify(token, appConfig.jwtSecret!);

            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;

            if (user.roleId !== Role.Admin) {
                return false;
            }

            return true;
        }
        catch (err: any) {
            return false;
        }
    }

    // Extract the user information from a previously verified JWT:
    public getUserFromToken(token: string): UserModel {
        const payload = jwt.decode(token) as { user: UserModel };
        return payload.user;
    }

}

export const cyber = new Cyber();
