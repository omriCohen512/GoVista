
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { createMcpServer } from "../mcp/mcp-server";
import { gptService } from "./gpt-service";

// Handles MCP tool calls and AI questions about vacation data:
class McpService {

    // Test the MCP connection by calling the most-liked vacation tool:
    public async testMostLikedVacation(): Promise<string> {

        // Create an MCP server and client:
        const server = createMcpServer();

        const client = new Client({
            name: "vacations-mcp-client",
            version: "1.0.0"
        });

        // Connect the client and server directly in memory:
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

        await server.connect(serverTransport);
        await client.connect(clientTransport);

        // Call a specific MCP tool without using AI:
        const result = await client.callTool({
            name: "get-most-liked-vacation",
            arguments: {}
        });

        const content = result.content[0];

        // Close both connections after receiving the result:
        await client.close();
        await server.close();

        if (content.type !== "text") {
            return "No result.";
        }

        return content.text;
    }

    // Answer a user's question using AI and the available MCP tools:
    public async ask(question: string): Promise<string> {

        // Prevent empty questions:
        if (!question || !question.trim()) {
            throw new ClientError(StatusCode.BadRequest, "Missing question.");
        }

        // Create an MCP server and client:
        const server = createMcpServer();

        const client = new Client({
            name: "vacations-mcp-client",
            version: "1.0.0"
        });

        // Connect the client and server directly in memory:
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

        await server.connect(serverTransport);
        await client.connect(clientTransport);

        // Get all available MCP tools and their input requirements:
        const tools = await client.listTools();

        const toolsText = tools.tools.map(tool =>
            `${tool.name}
Description: ${tool.description}
Input: ${JSON.stringify(tool.inputSchema)}`
        ).join("\n\n");

        // Ask GPT to choose the correct MCP tool and return a JSON decision:
        const systemPrompt = `
You select the correct MCP database tool for the user's question.

Available tools:

${toolsText}

Return JSON only in this format:

{"tool":"tool-name","arguments":{}}

Use the exact tool name and the arguments required by its input schema.

If none of the available tools can answer the question return:

{"tool":"none","arguments":{}}
`;

        const decisionText = await gptService.getCompletion(systemPrompt, question);

        // Remove Markdown code fences before parsing the JSON response:
        const cleanDecision = decisionText
            .replace("```json", "")
            .replace("```", "")
            .trim();

        const decision = JSON.parse(cleanDecision);

        // Return a message if no available MCP tool can answer the question:
        if (decision.tool === "none") {
            await client.close();
            await server.close();
            return "I can only answer questions about the vacation data available through the MCP tools.";
        }

        // Execute the tool selected by GPT:
        const result = await client.callTool({
            name: decision.tool,
            arguments: decision.arguments
        });

        const content = result.content[0];

        // Close both connections after receiving the database result:
        await client.close();
        await server.close();

        if (content.type !== "text") {
            return "No data found.";
        }

        // Ask GPT to explain the database result without inventing information:
        const answerPrompt = `
The user asked:
${question}

The vacation database returned:
${content.text}

Answer the user's question using only the database result.

Keep the answer short and clear.
If the result contains no vacations, say that no matching vacations were found.
Do not invent any information that is not contained in the database result.
`;

        const answer = await gptService.getCompletion(
            "You answer questions about the GoVista vacations database.",
            answerPrompt
        );

        return answer;
    }

}

export const mcpService = new McpService();
