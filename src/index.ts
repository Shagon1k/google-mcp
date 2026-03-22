import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolRegistry } from './registry/toolRegistry.js';
import { gmailTools } from './services/gmail/index.js';
import { calendarTools } from './services/calendar/index.js';
import { youtubeTools } from './services/youtube/index.js';

const server = new McpServer({
    name: 'google-mcp',
    version: '1.0.0',
});

const registry = new ToolRegistry(server);

registry.registerTools(gmailTools);     // Register Gmail tools
registry.registerTools(calendarTools);  // Register Calendar tools
registry.registerTools(youtubeTools);   // Register YouTube tools

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Google MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
