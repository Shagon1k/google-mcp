import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolRegistry } from './registry/toolRegistry.js';
import { gmailTools } from './services/gmail/index.js';
import { calendarTools } from './services/calendar/index.js';

const server = new McpServer({
    name: 'google-mcp',
    version: '1.0.0',
});

const registry = new ToolRegistry(server);

// Register Gmail tools
registry.registerTools(gmailTools);

// Register Calendar tools
registry.registerTools(calendarTools);

// Future: Add more services here
// registry.registerTools(driveTools);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gmail MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
