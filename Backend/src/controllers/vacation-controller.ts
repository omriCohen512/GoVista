
import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { StatusCode } from "../models/enums";
import { VacationModel } from "../models/vacation-model";
import { vacationService } from "../services/vacation-service";
import { cyber } from "../utils/cyber";

// Handles vacation API routes and HTTP requests:
class VacationController {

    // Create a router for vacation endpoints:
    public router: Router = express.Router();

    // Register routes and protect admin operations:
    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacations);
        this.router.get("/api/vacations/report", securityMiddleware.verifyAdmin, this.getVacationReport);
        this.router.get("/api/vacations/report/csv", securityMiddleware.verifyAdmin, this.getVacationReportCsv);
        this.router.get("/api/vacations/:id", securityMiddleware.verifyAdmin, this.getOneVacation);
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:id", securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:id", securityMiddleware.verifyAdmin, this.deleteVacation);
    }

    // Get all vacations with likes information for the logged-in user:
    private async getAllVacations(request: Request, response: Response): Promise<void> {

        // Extract the user ID from the JWT token:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);
        const user = cyber.getUserFromToken(token!);

        const vacations = await vacationService.getAllVacations(user.userId);
        response.json(vacations);
    }

    // Get one vacation by its URL parameter:
    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.id;
        const vacation = await vacationService.getOneVacation(vacationId);
        response.json(vacation);
    }

    // Add a vacation with an uploaded image:
    private async addVacation(request: Request, response: Response): Promise<void> {

        // Attach the uploaded image to the vacation data:
        request.body.image = request.files?.image;

        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationService.addVacation(vacation);

        // Send HTTP 201 when the vacation is created:
        response.status(StatusCode.Created).json(dbVacation);
    }

    // Update a vacation using its ID from the URL:
    private async updateVacation(request: Request, response: Response): Promise<void> {

        // Add the vacation ID and optional new image to the request body:
        request.body.vacationId = +request.params.id;
        request.body.image = request.files?.image;

        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationService.updateVacation(vacation);
        response.json(dbVacation);
    }

    // Delete a vacation:
    private async deleteVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.id;
        await vacationService.deleteVacation(vacationId);

        // Send HTTP 204 because no response body is needed:
        response.status(StatusCode.NoContent).json();
    }

    // Get vacation likes data for the admin report:
    private async getVacationReport(request: Request, response: Response): Promise<void> {
        const report = await vacationService.getVacationReport();
        response.json(report);
    }

    // Download the vacation likes report as CSV:
    private async getVacationReportCsv(request: Request, response: Response): Promise<void> {
        const csv = await vacationService.getVacationReportCsv();

        // Set response headers to download a CSV file:
        response.setHeader("Content-Type", "text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=vacations-report.csv");

        response.send(csv);
    }

}

export const vacationController = new VacationController();
