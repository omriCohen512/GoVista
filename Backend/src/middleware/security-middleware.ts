
import { Express, NextFunction, Request, Response } from "express";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import striptags from "striptags";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { cyber } from "../utils/cyber";

// Handles authentication, authorization and security protections:
class SecurityMiddleware {

    // Verify that the user has a valid JWT token:
    public verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {

        // Extract the JWT from the Authorization header:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        if (cyber.verifyToken(token!)) {
            next();
        }
        else {
            const err = new ClientError(StatusCode.Unauthorized, "You are not logged in.");
            next(err);
        }
    }

    // Verify that the logged-in user is an admin:
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {

        // Extract the JWT from the Authorization header:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        if (cyber.verifyAdmin(token!)) {
            next();
        }
        else {
            const err = new ClientError(StatusCode.Forbidden, "You are not authorized.");
            next(err);
        }
    }

    // Remove HTML tags from string values in the request body:
    public preventXss(request: Request, response: Response, next: NextFunction): void {

        for (const prop in request.body) {
            const value = request.body[prop];

            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }

        next();
    }

    // Limit the number of requests from each client:
    public registerRateLimit(server: Express): void {
        server.use(expressRateLimit({
            windowMs: 1000,
            limit: 1000
        }));
    }

    // Add security headers using Helmet:
    public headerProtection(server: Express): void {
        server.use(helmet({
            crossOriginResourcePolicy: { policy: "same-site" }
        }));
    }

}

export const securityMiddleware = new SecurityMiddleware();
