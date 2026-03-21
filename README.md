# Google MCP

Minimal Model Context Protocol server for Google tools. The server runs over `stdio` and exposes a small set of:
- Gmail tools for reading messages and performing bulk mailbox actions
- TODO

## Prerequisites

- Node.js 20+
- A Google Cloud project with Gmail API enabled
- OAuth client credentials for a Desktop application or another client type that supports the redirect URI you configure

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

## Google OAuth Setup

1. Create or select a Google Cloud project.
2. Enable the Gmail API.
3. Configure the OAuth consent screen.
4. Create OAuth client credentials.
5. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in `.env`.

To generate a refresh token for this project:

```bash
npm run auth
```

The script prints an authorization URL. Open it, grant access, paste the returned code back into the terminal, and copy the generated `GOOGLE_REFRESH_TOKEN` into `.env`.

The auth flow currently requests these Gmail scopes:

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.modify`

## Available Scripts

- `npm run dev` - run the MCP server directly from TypeScript with `tsx`
- `npm run auth` - run the OAuth helper in `auth.js` to obtain a refresh token
- `npm run build` - compile TypeScript into `build/`

## Running the Server

Development:

```bash
npm run dev
```

Production-style build:

```bash
npm run build
node build/index.js
```

The server uses stdio transport, so it is intended to be launched by an MCP-compatible client.

## Exposed MCP Tools

### Gmail

#### `get_emails`

Returns full email items with sender, subject, date, labels, snippet, and a truncated body.

Inputs:

- `type`: mailbox type, default `UNREAD`
- `maxCount`: number of emails to fetch, `1-50`, default `10`

#### `get_email_summaries`

Returns lightweight message metadata for bulk actions.

Inputs:

- `type`: mailbox type, default `UNREAD`
- `maxCount`: number of summaries to fetch

#### `mark_emails_as_read`

Marks the provided Gmail message IDs as read.

Inputs:

- `emailIds`: array of Gmail message IDs

#### `archive_emails`

Archives the provided Gmail message IDs.

Inputs:

- `emailIds`: array of Gmail message IDs

#### `trash_emails`

Moves the provided Gmail message IDs to trash.

Inputs:

- `emailIds`: array of Gmail message IDs

## Example MCP Client Command

If your MCP client accepts a stdio server command, point it at the built entrypoint:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/google-mcp/build/index.js"],
  "env": {
    "GOOGLE_CLIENT_ID": "your_google_client_id",
    "GOOGLE_CLIENT_SECRET": "your_google_client_secret",
    "GOOGLE_REDIRECT_URI": "your_google_redirect_uri",
    "GOOGLE_REFRESH_TOKEN": "your_google_refresh_token"
  }
}
```

For local development, you can also point the client at `tsx src/index.ts` instead of the built output.

## Project Structure

```text
src/
  index.ts                MCP server bootstrap
  registry/               Tool registration
  services/gmail/         Gmail tool definitions, queries, and actions
  shared/getClient.ts     Google OAuth client and Gmail client factory
auth.js                   OAuth helper for generating a refresh token
build/                    Compiled output
```

## Notes

- Authentication is based on an OAuth refresh token loaded from environment variables.
- Bulk actions de-duplicate message IDs before sending requests to Gmail.
- Email bodies returned by the server are intentionally truncated.
