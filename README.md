# Google MCP

Minimal Model Context Protocol server for Google services. Runs over `stdio` and exposes tools for Gmail, Google Calendar, and YouTube.

## Prerequisites

- Node.js 20+
- A Google Cloud project with Gmail API, Google Calendar API, and YouTube Data API v3 enabled
- OAuth 2.0 client credentials (Desktop app type)

## OAuth Setup

Run the auth command to generate a refresh token. Pass your OAuth client credentials as flags:

```bash
npx google-mcp auth --client-id=<your_client_id> --client-secret=<your_client_secret>
```

Open the printed URL, grant access, paste the code back into the terminal, and copy the resulting `GOOGLE_REFRESH_TOKEN` into your MCP client config.

Scopes requested:

- `gmail.readonly` + `gmail.modify`
- `calendar.events`
- `youtube.readonly`

## MCP Client Config

```json
{
  "command": "npx",
  "args": ["-y", "google-mcp"],
  "env": {
    "GOOGLE_CLIENT_ID": "...",
    "GOOGLE_CLIENT_SECRET": "...",
    "GOOGLE_REFRESH_TOKEN": "..."
  }
}
```

## Local Development

Clone the repo and install dependencies:

```bash
npm install
```

Create a `.env` file (see `.env.example`) with your credentials, then:

```bash
# Run the MCP server
npm run dev

# Run the auth flow
npm run auth -- --client-id=<id> --client-secret=<secret>

# Compile
npm run build
```

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
  index.ts                        MCP server entry point + CLI dispatcher
  auth.ts                         OAuth auth subcommand
  registry/                       Tool registration
  shared/auth.ts                  OAuth client factory
  services/
    gmail/                        Gmail queries, actions, MCP tools
    calendar/                     Calendar queries, actions, MCP tools
    youtube/                      YouTube search, MCP tools
build/                            Compiled output
```
