import { google } from 'googleapis';
import http from 'http';
import { parseArgs } from 'util';

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/youtube.readonly',
];

const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

export async function runAuth(): Promise<void> {
    const { values } = parseArgs({
        args: process.argv.slice(3),
        options: {
            'client-id': { type: 'string' },
            'client-secret': { type: 'string' },
        },
    });

    const clientId = values['client-id'] ?? process.env.GOOGLE_CLIENT_ID;
    const clientSecret = values['client-secret'] ?? process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error('Missing credentials. Either set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file, or pass them explicitly:');
        console.error('  google-mcp auth --client-id=<id> --client-secret=<secret>');
        process.exit(1);
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });

    console.log('\n👉 Open this URL in your browser:\n\n', url, '\n');

    await new Promise<void>((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            const code = new URL(req.url!, REDIRECT_URI).searchParams.get('code');
            if (!code) {
                res.end('No code received.');
                return;
            }

            res.end('<h2>✅ Authentication successful — you can close this tab.</h2>');
            server.close();

            try {
                const { tokens } = await oauth2Client.getToken(code);
                console.log('\n✅ Add this to your MCP client config env:\n');
                console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
                resolve();
            } catch (err) {
                reject(err);
            }
        });

        server.listen(REDIRECT_PORT, () => {
            console.log(`Waiting for Google to redirect to localhost:${REDIRECT_PORT} ...\n`);
        });
    });
}
