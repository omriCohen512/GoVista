
import dotenv from "dotenv";

// Load .env values into process.env:
dotenv.config({ quiet: true });

// Contains application configuration values:
class AppConfig {

    // Environment:
    public readonly environment = process.env.ENVIRONMENT!;
    public readonly isDevelopment = this.environment === "development";
    public readonly isProduction = this.environment === "production";

    // Server and database:
    public readonly port = 4000;
    public readonly mysqlHost = process.env.MYSQL_HOST!;
    public readonly mysqlUser = process.env.MYSQL_USER!;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD!;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE!;

    // Security:
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly hashSalt = process.env.HASH_SALT!;
    public readonly recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY!;

    // OpenAI configuration:
    public readonly openaiApiKey = process.env.OPENAI_API_KEY!;
    public readonly openaiModel = "gpt-5.6-luna";
    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";

}

export const appConfig = new AppConfig();
