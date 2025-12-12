import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1. Initialize Server
const server = new Server(
  {
    name: "weather-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Define the Schema using Zod
const WeatherSchema = z.object({
  latitude: z.number().describe("Latitude of the location"),
  longitude: z.number().describe("Longitude of the location"),
});

// 3. List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_weather",
        description: "Get current temperature for a specific latitude/longitude",
        // @ts-ignore - zod-to-json-schema types can be strict, ignoring for simplicity
        inputSchema: zodToJsonSchema(WeatherSchema),
      },
    ],
  };
});

// 4. Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    // Validate input matches schema
    const args = WeatherSchema.safeParse(request.params.arguments);

    if (!args.success) {
      throw new Error("Invalid arguments: " + args.error.message);
    }

    const { latitude, longitude } = args.data;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
      );
      
      const data = await response.json();
      const temp = data.current.temperature_2m;
      
      return {
        content: [
          {
            type: "text",
            text: `The current temperature at ${latitude}, ${longitude} is ${temp}°C.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching weather: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error("Tool not found");
});

// 5. Start the Server
const transport = new StdioServerTransport();
await server.connect(transport);