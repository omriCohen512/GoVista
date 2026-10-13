
import axios from "axios";
import { appConfig } from "../utils/app-config";

// Handles communication with the OpenAI API:
class GptService {

    // Send system and user prompts to GPT and receive a response:
    public async getCompletion(systemPrompt: string, userPrompt: string): Promise<string> {

        // Prepare the API request with the model and conversation messages:
        const body = {
            model: appConfig.openaiModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        };

        // Add the API key to the Authorization header:
        const options = {
            headers: {
                authorization: "Bearer " + appConfig.openaiApiKey
            }
        };

        // Send a POST request to the OpenAI API:
        const response = await axios.post(appConfig.openaiUrl, body, options);

        // Extract the generated text from the API response:
        const completion = response.data.choices[0].message.content;

        return completion;
    }

}

export const gptService = new GptService();
