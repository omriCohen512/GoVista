
import { NextFunction, Request, Response } from "express";
import colors from "colors";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { appConfig } from "../utils/app-config";

// Handles unknown routes and application errors:
class ErrorMiddleware {

    // Handle requests that don't match any registered route:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Handle errors from controllers and middleware:
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

        // Use the error status or default to HTTP 500:
        const status = err.status || StatusCode.InternalServerError;

        // Hide internal server error details in production:
        const isServerError = status >= 500 && status <= 599;
        const message = isServerError && appConfig.isProduction ? "Some error, please try again." : err.message;

        // Log the error to the backend console:
        console.log(colors.red(err.message));

        // Send the error status and message to the frontend:
        response.status(status).json({ message });
    }

}

export const errorMiddleware = new ErrorMiddleware();
