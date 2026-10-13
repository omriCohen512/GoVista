
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { gptService } from "./gpt-service";

// Handles AI vacation recommendations:
class AiService {

    // Generate a travel recommendation for a destination:
    public async getRecommendation(destination: string): Promise<string> {

        // Reject empty or missing destinations:
        if (!destination || destination.trim().length === 0) {
            throw new ClientError(StatusCode.BadRequest, "Missing destination.");
        }

        // Define the AI assistant's role and required response format:
        const systemPrompt = `
        You are the GoVista travel assistant.
        Give a short, useful and friendly vacation recommendation.

        Always return the answer in this exact Markdown structure:

        ## Destination Name

        Write a short introduction explaining why the destination is worth visiting.

        ### Top Things to Do
        - **Activity or attraction name** - short explanation.
        - **Activity or attraction name** - short explanation.
        - **Activity or attraction name** - short explanation.

        ### Food Recommendation
        Write one short local food recommendation.

        ### Travel Tip
        Write one useful practical travel tip.

        Keep the answer concise.
        Do not add sections outside this structure.
        Do not write more than 3 activities.
        `;

        // Create the user prompt using the selected destination:
        const userPrompt = `Give me a vacation recommendation for ${destination}.`;

        // Send both prompts to GPT and receive the recommendation:
        const recommendation = await gptService.getCompletion(systemPrompt, userPrompt);

        return recommendation;
    }

}

export const aiService = new AiService();
