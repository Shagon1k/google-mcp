import { google } from 'googleapis';
import readline from 'readline';
import { parseArgs } from 'util';

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/youtube.readonly',
];

export async function runAuth(): Promise<void> {
    const { values } = parseArgs({
        args: process.argv.slice(3),
        options: {
            'client-id': { type: 'string' },
            'client-secret': { type: 'string' },
        },
    });

    const clientId = values['client-id'];
    const clientSecret = values['client-secret'];

    if (!clientId || !clientSecret) {
        console.error('Usage: google-mcp auth --client-id=<id> --client-secret=<secret>');
        process.exit(1);
    }

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'urn:ietf:wg:oauth:2.0:oob'
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });

    console.log('\n👉 Open this URL in your browser:\n\n', url, '\n');

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Paste the authorisation code: ', async (code) => {
        const { tokens } = await oauth2Client.getToken(code.trim());
        console.log('\n✅ Add this to your MCP client config env:\n');
        console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
        rl.close();
    });
}
