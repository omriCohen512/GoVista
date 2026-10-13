
class AppConfig {

    // Backend API endpoints.
    public readonly registerUrl = "http://localhost:4000/api/register";
    public readonly loginUrl = "http://localhost:4000/api/login";
    public readonly vacationsUrl = "http://localhost:4000/api/vacations";
    public readonly vacationsImagesUrl = "http://localhost:4000/api/vacations/images/";
    public readonly likesUrl = "http://localhost:4000/api/likes/";
    public readonly aiUrl = "http://localhost:4000/api/ai/recommend";
    public readonly mcpUrl = "http://localhost:4000/api/mcp/ask";

    // Load the public reCAPTCHA site key from Vite environment variables.
    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();
