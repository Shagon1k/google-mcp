// auth.js
import { google } from 'googleapis';
import readline from 'readline';
import 'dotenv/config';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/youtube.readonly',
  ],
  prompt: 'consent',  // forces Google to reissue refresh token with new scopes
});

console.log('\n👉 Open this URL in your browser:\n\n', url, '\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Paste the authorisation code: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code.trim());
  console.log('\n✅ Add this to your .env:\n');
  console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
  rl.close();
});
