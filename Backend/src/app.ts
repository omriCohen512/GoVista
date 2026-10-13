
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { aiController } from "./controllers/ai-controller";
import { authController } from "./controllers/auth-controller";
import { likeController } from "./controllers/like-controller";
import { mcpController } from "./controllers/mcp-controller";
import { vacationController } from "./controllers/vacation-controller";
import { errorMiddleware } from "./middleware/error-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";

class App {

    public start(): void {

        // Configure vacation images folder:
        saver.config(path.join(__dirname, "assets", "images"));

        // Create our server object:
        const server = express();

        // System middleware:
        securityMiddleware.registerRateLimit(server);
        securityMiddleware.headerProtection(server);
        server.use(cors());
        server.use(express.json());
        server.use(expressFileUpload());

        // Serve vacation images:
        server.use("/api/vacations/images", express.static(path.join(__dirname, "assets", "images")));

        // Register "before" middleware:
        server.use(securityMiddleware.preventXss);

        // Register controllers:
        server.use(authController.router);
        server.use(vacationController.router);
        server.use(likeController.router);
        server.use(aiController.router);
        server.use(mcpController.router);

        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Run server:
        server.listen(appConfig.port, () => console.log("Listening..."));
    }

}

const app = new App();
app.start();
