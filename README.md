# Google MCP

Minimal Model Context Protocol server for Google services. Runs over `stdio` and exposes tools for Gmail, Google Calendar, and YouTube.

## Prerequisites

- Node.js 20+
- A Google Cloud project with Gmail API, Google Calendar API, and YouTube Data API v3 enabled
- OAuth 2.0 client credentials (Desktop app type)

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

## OAuth Setup

Run the auth helper to generate a refresh token:

```bash
npm run auth
```

Open the printed URL, grant access, paste the code back into the terminal, and copy the resulting `GOOGLE_REFRESH_TOKEN` into `.env`.

Scopes requested:

- `gmail.readonly` + `gmail.modify`
- `calendar.events`
- `youtube.readonly`

## Available Scripts

- `npm run dev` — run the server from TypeScript with `tsx`
- `npm run auth` — generate an OAuth refresh token
- `npm run build` — compile TypeScript into `build/`

## Running the Server

```bash
# Development
npm run dev

# Production
npm run build
node build/index.js
```

## MCP Client Config

```json
{
  "command": "node",
  "args": ["/absolute/path/to/google-mcp/build/index.js"],
  "env": {
    "GOOGLE_CLIENT_ID": "...",
    "GOOGLE_CLIENT_SECRET": "...",
    "GOOGLE_REDIRECT_URI": "...",
    "GOOGLE_REFRESH_TOKEN": "..."
  }
}
```

For development, replace `node build/index.js` with `npx tsx src/index.ts`.

## Exposed MCP Tools

### Gmail

| Tool | Description |
|---|---|
| `get_emails` | Fetch full emails from a mailbox. Inputs: `type` (default `UNREAD`), `maxCount` (1–50, default 10) |
| `get_email_summaries` | Fetch lightweight metadata for bulk actions. Inputs: `type`, `maxCount` (1–150, default 25) |
| `mark_emails_as_read` | Mark emails as read. Inputs: `emailIds` |
| `archive_emails` | Archive emails. Inputs: `emailIds` |
| `trash_emails` | Move emails to trash. Inputs: `emailIds` |

Supported mailbox types: `INBOX`, `UNREAD`, `SENT`, `PROMOTIONS`, `SOCIAL`, `UPDATES`.

### Calendar

| Tool | Description |
|---|---|
| `get_calendar_events` | Fetch events in a time range. Inputs: `fromDate`, `toDate` (ISO 8601) |
| `create_calendar_event` | Create a new event. Inputs: `summary`, `start`, `end`, optional `description`, `location`, `attendees` |

### YouTube

| Tool | Description |
|---|---|
| `search_youtube_videos` | Search videos by query. Inputs: `query`, `maxResults` (1–50, default 10), `videoDuration` (`any` / `short` <4 min / `medium` 4–20 min / `long` >20 min, default `any`) |

## Project Structure

```text
src/
  index.ts                        MCP server bootstrap
  registry/                       Tool registration
  shared/auth.ts                  OAuth client factory
  services/
    gmail/                        Gmail queries, actions, MCP tools
    calendar/                     Calendar queries, actions, MCP tools
    youtube/                      YouTube search, MCP tools
auth.js                           OAuth helper script
build/                            Compiled output
```
