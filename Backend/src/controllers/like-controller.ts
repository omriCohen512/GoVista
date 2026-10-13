
import express, { Request, Response, Router } from "express";
import { ClientError } from "../models/client-error";
import { Role, StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";
import { likeService } from "../services/like-service";
import { cyber } from "../utils/cyber";

// Handles vacation likes and unlikes:
class LikeController {

    // Create a router for like endpoints:
    public router: Router = express.Router();

    // Register routes for logged-in users:
    public constructor() {
        this.router.post("/api/likes/:vacationId", securityMiddleware.verifyLoggedIn, this.addLike);
        this.router.delete("/api/likes/:vacationId", securityMiddleware.verifyLoggedIn, this.deleteLike);
    }

    // Add a like for the logged-in user:
    private async addLike(request: Request, response: Response): Promise<void> {

        // Get the vacation ID and user information from the request:
        const vacationId = +request.params.vacationId;
        const authentication = request.headers.authorization;
        const token = authentication?.substring(7);
        const user = cyber.getUserFromToken(token!);

        // Admins are not allowed to like vacations:
        if (user.roleId === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admin cannot like vacations.");
        }

        // Prevent the same user from liking a vacation twice:
        const isLiked = await likeService.isLiked(user.userId, vacationId);

        if (isLiked) {
            throw new ClientError(StatusCode.BadRequest, "Vacation already liked.");
        }

        // Save the like in MySQL:
        await likeService.addLike(user.userId, vacationId);
        response.sendStatus(StatusCode.Created);
    }

    // Remove a like for the logged-in user:
    private async deleteLike(request: Request, response: Response): Promise<void> {

        // Get the vacation ID and user information from the request:
        const vacationId = +request.params.vacationId;
        const authentication = request.headers.authorization;
        const token = authentication?.substring(7);
        const user = cyber.getUserFromToken(token!);

        // Admins are not allowed to unlike vacations:
        if (user.roleId === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admin cannot unlike vacations.");
        }

        // Make sure the user has already liked the vacation:
        const isLiked = await likeService.isLiked(user.userId, vacationId);

        if (!isLiked) {
            throw new ClientError(StatusCode.NotFound, "Like not found.");
        }

        // Remove the like from MySQL:
        await likeService.deleteLike(user.userId, vacationId);
        response.sendStatus(StatusCode.NoContent);
    }

}

export const likeController = new LikeController();
