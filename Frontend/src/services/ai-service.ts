
import axios from "axios";
import { appConfig } from "../utils/app-config";

class AiService {

    // Send the destination to the backend for an AI recommendation.
    public async getRecommendation(destination: string): Promise<string> {
        const body = { destination };
        const response = await axios.post<{ recommendation: string }>(appConfig.aiUrl, body);

        // Return only the recommendation text from the response.
        return response.data.recommendation;
    }
}

export const aiService = new AiService();
