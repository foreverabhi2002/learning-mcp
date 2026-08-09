import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
  name: "my-first-mcp-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "../mcp-server/src/index.ts"],
});

await client.connect(transport);

console.log("Connected to MCP server");

const tools = await client.listTools();

console.log("Available tools:");
console.log(tools.tools);

const args = {
  a: Math.floor(Math.random() * 10),
  b: Math.floor(Math.random() * 10),
};

console.log("Calling tool 'add' with arguments:");
console.log(args);

const addResult = await client.callTool({
  name: "add",
  arguments: args,
});

const subtractResult = await client.callTool({
  name: "subtract",
  arguments: args,
});

const multiplyResult = await client.callTool({
  name: "multiply",
  arguments: args,
});

const divideResult = await client.callTool({
  name: "divide",
  arguments: args,
});

console.log("Tool result:");
console.log("Add result:", addResult);
console.log("Subtract result:", subtractResult);
console.log("Multiply result:", multiplyResult);
console.log("Divide result:", divideResult);
