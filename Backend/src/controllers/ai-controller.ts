
import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { aiService } from "../services/ai-service";

// Handles AI recommendation requests:
class AiController {

    // Router for AI endpoints:
    public router: Router = express.Router();

    // Register the recommendation route for logged-in users:
    public constructor() {
        this.router.post("/api/ai/recommend", securityMiddleware.verifyLoggedIn, this.getRecommendation);
    }

    // Generate a travel recommendation for the requested destination:
    private async getRecommendation(request: Request, response: Response): Promise<void> {
        const destination = request.body.destination;
        const recommendation = await aiService.getRecommendation(destination);
        response.json({ recommendation });
    }

}

export const aiController = new AiController();
