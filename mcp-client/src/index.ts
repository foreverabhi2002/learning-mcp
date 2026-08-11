import ollama from "ollama";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const mcpClient = new Client({
  name: "ollama-mcp-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "../mcp-server/src/index.ts"],
});

await mcpClient.connect(transport);

console.log("Connected to MCP server");

const mcpTools = await mcpClient.listTools();
// console.log(mcpTools.tools);

const ollamaTools = mcpTools.tools.map((tool) => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description ?? "",
    parameters: tool.inputSchema,
  },
}));

const messages = [
  {
    role: "user",
    content: "What is 25 + 17?",
  },
];

const response = await ollama.chat({
  model: "llama3.2:3b",
  messages,
  tools: ollamaTools,
});

console.log(response.message.tool_calls);

if (response.message.tool_calls) {
  for (const toolCall of response.message.tool_calls) {
    const toolName = toolCall.function.name;
    const arguments_ = toolCall.function.arguments;

    console.log("LLM requested:", toolName);
    console.log("Arguments:", arguments_);

    const normalizedArguments = Object.fromEntries(
      Object.entries(arguments_).map(([key, value]) => [
        key,
        typeof value === "string" &&
        value.trim() !== "" &&
        !Number.isNaN(Number(value))
          ? Number(value)
          : value,
      ]),
    );

    const result = await mcpClient.callTool({
      name: toolName,
      arguments: normalizedArguments,
    });

    console.log("MCP result:", result);
  }
}
