
import axios from "axios";
import { appConfig } from "../utils/app-config";

class McpService {

    // Send the user's question to the backend MCP endpoint.
    public async ask(question: string): Promise<string> {
        const body = { question };
        const response = await axios.post<{ answer: string }>(appConfig.mcpUrl, body);

        // Return the answer text received from the backend.
        return response.data.answer;
    }
}

export const mcpService = new McpService();
