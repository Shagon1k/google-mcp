import { google, gmail_v1 } from 'googleapis';

function createOAuthClient(): gmail_v1.Gmail['context']['_options']['auth'] {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return auth;
}

export function getClient(): gmail_v1.Gmail {
    const auth = createOAuthClient();
    return google.gmail({ version: 'v1', auth });
}
