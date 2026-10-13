
import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { mcpService } from "../services/mcp-service";

// Handles MCP testing and vacation-related questions:
class McpController {

    // Create a router for MCP endpoints:
    public router: Router = express.Router();

    // Register MCP routes for logged-in users:
    public constructor() {
        this.router.get("/api/mcp/test", securityMiddleware.verifyLoggedIn, this.testMcp);
        this.router.post("/api/mcp/ask", securityMiddleware.verifyLoggedIn, this.ask);
    }

    // Test the MCP functionality by retrieving the most-liked vacation:
    private async testMcp(request: Request, response: Response): Promise<void> {
        const result = await mcpService.testMostLikedVacation();
        response.json({ result });
    }

    // Send a user's question to the MCP service:
    private async ask(request: Request, response: Response): Promise<void> {
        const question = request.body.question;
        const answer = await mcpService.ask(question);
        response.json({ answer });
    }

}

export const mcpController = new McpController();
