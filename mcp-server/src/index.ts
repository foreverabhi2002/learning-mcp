import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-first-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "add",
  {
    title: "Add Two Numbers",
    description: "Adds two numbers together.",
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    outputSchema: z.object({
      result: z.number(),
    }),
  },
  ({ a, b }: { a: number; b: number }) => {
    const result = a + b;
    return {
      content: [
        {
          type: "text",
          text: String(result),
        },
      ],
      structuredContent: {
        result,
      },
    };
  },
);

server.registerTool(
  "subtract",
  {
    title: "Subtract Two Numbers",
    description: "Subtracts two numbers.",
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    outputSchema: z.object({
      result: z.number(),
    }),
  },
  ({ a, b }: { a: number; b: number }) => {
    const result = a - b;
    return {
      content: [
        {
          type: "text",
          text: String(result),
        },
      ],
      structuredContent: {
        result,
      },
    };
  },
);

server.registerTool(
  "multiply",
  {
    title: "Multiply Two Numbers",
    description: "Multiplies two numbers together.",
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    outputSchema: z.object({
      result: z.number(),
    }),
  },
  ({ a, b }: { a: number; b: number }) => {
    const result = a * b;
    return {
      content: [
        {
          type: "text",
          text: String(result),
        },
      ],
      structuredContent: {
        result,
      },
    };
  },
);

server.registerTool(
  "divide",
  {
    title: "Divide Two Numbers",
    description: "Divides two numbers.",
    inputSchema: z.object({
      a: z.number(),
      b: z.number().refine((b) => b !== 0, {
        message: "Cannot divide by zero",
      }),
    }),
    outputSchema: z.object({
      result: z.number(),
    }),
  },
  ({ a, b }: { a: number; b: number }) => {
    const result = a / b;
    return {
      content: [
        {
          type: "text",
          text: String(result),
        },
      ],
      structuredContent: {
        result,
      },
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);
