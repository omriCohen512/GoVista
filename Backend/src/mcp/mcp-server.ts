
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { dal } from "../utils/dal";

// Create an MCP server with tools for reading vacation data:
export function createMcpServer(): McpServer {

    const server = new McpServer({
        name: "vacations-mcp-server",
        version: "1.0.0"
    });

    // Find the vacation with the highest number of likes:
    server.registerTool(
        "get-most-liked-vacation",
        {
            description: "Get the vacation with the highest number of likes.",
            inputSchema: z.object({})
        },
        async () => {

            // Count likes for each vacation and return the first result:
            const sql = `
                select v.vacationId, v.destination, v.startDate, v.endDate,
                v.price, count(l.userId) as likesCount
                from vacations as v
                left join likes as l on v.vacationId = l.vacationId
                group by v.vacationId, v.destination, v.startDate, v.endDate, v.price
                order by likesCount desc
                limit 1
            `;

            const vacations = await dal.execute(sql) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations[0])
                    }
                ]
            };
        }
    );

    // Get all vacations with their like counts:
    server.registerTool(
        "get-all-vacations",
        {
            description: "Get all vacations with destination, dates, price and number of likes.",
            inputSchema: z.object({})
        },
        async () => {

            // Include vacations without likes using LEFT JOIN:
            const sql = `
                select v.vacationId, v.destination, v.startDate, v.endDate,
                v.price, count(l.userId) as likesCount
                from vacations as v
                left join likes as l on v.vacationId = l.vacationId
                group by v.vacationId, v.destination, v.startDate, v.endDate, v.price
                order by v.startDate
            `;

            const vacations = await dal.execute(sql) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    // Get vacations active on a selected date:
    server.registerTool(
        "get-vacations-by-date",
        {
            description: "Get vacations that are active on a specific date.",
            inputSchema: z.object({
                date: z.string().describe("Date in YYYY-MM-DD format")
            })
        },
        async ({ date }) => {

            // Find vacations whose date range includes the selected date:
            const sql = `
                select vacationId, destination, startDate, endDate, price
                from vacations
                where ? between startDate and endDate
                order by startDate
            `;

            const vacations = await dal.execute(sql, [date]) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    // Get all vacations currently active:
    server.registerTool(
        "get-active-vacations",
        {
            description: "Get all vacations that are active today.",
            inputSchema: z.object({})
        },
        async () => {

            // CURDATE returns today's date from MySQL:
            const sql = `
                select vacationId, destination, startDate, endDate, price
                from vacations
                where curdate() between startDate and endDate
                order by startDate
            `;

            const vacations = await dal.execute(sql) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    // Get vacations that haven't started yet:
    server.registerTool(
        "get-upcoming-vacations",
        {
            description: "Get all vacations that have not started yet.",
            inputSchema: z.object({})
        },
        async () => {

            // Compare each start date with today's date:
            const sql = `
                select vacationId, destination, startDate, endDate, price
                from vacations
                where startDate > curdate()
                order by startDate
            `;

            const vacations = await dal.execute(sql) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    // Get summary statistics about all vacations:
    server.registerTool(
        "get-vacation-statistics",
        {
            description: "Get vacation statistics including total vacations, active vacations, upcoming vacations and average price.",
            inputSchema: z.object({})
        },
        async () => {

            // Calculate vacation counts and the average price in one SQL query:
            const sql = `
                select
                count(*) as totalVacations,
                sum(case when curdate() between startDate and endDate then 1 else 0 end) as activeVacations,
                sum(case when startDate > curdate() then 1 else 0 end) as upcomingVacations,
                round(avg(price), 2) as averagePrice
                from vacations
            `;

            const statistics = await dal.execute(sql) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(statistics[0])
                    }
                ]
            };
        }
    );

    // Get vacations within a selected price range:
    server.registerTool(
        "get-vacations-by-price-range",
        {
            description: "Get vacations whose price is between a minimum and maximum price.",
            inputSchema: z.object({
                minPrice: z.number().describe("Minimum vacation price"),
                maxPrice: z.number().describe("Maximum vacation price")
            })
        },
        async ({ minPrice, maxPrice }) => {

            // Use SQL placeholders for the minimum and maximum prices:
            const sql = `
                select vacationId, destination, startDate, endDate, price
                from vacations
                where price between ? and ?
                order by price
            `;

            const values = [minPrice, maxPrice];
            const vacations = await dal.execute(sql, values) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    // Search vacations by destination:
    server.registerTool(
        "search-vacations",
        {
            description: "Search vacations by destination text.",
            inputSchema: z.object({
                text: z.string().describe("Text to search inside the vacation destination")
            })
        },
        async ({ text }) => {

            // Use LIKE with wildcards to find destinations containing the search text:
            const sql = `
                select vacationId, destination, startDate, endDate, price
                from vacations
                where destination like ?
                order by startDate
            `;

            const values = [`%${text}%`];
            const vacations = await dal.execute(sql, values) as any[];

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(vacations)
                    }
                ]
            };
        }
    );

    return server;
}
