import { google, gmail_v1 } from 'googleapis';

export function createOAuthClient(): gmail_v1.Gmail['context']['_options']['auth'] {
    const auth = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    auth.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return auth;
}
