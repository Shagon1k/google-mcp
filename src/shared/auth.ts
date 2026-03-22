import { google, gmail_v1 } from 'googleapis';

export function createOAuthClient(): gmail_v1.Gmail['context']['_options']['auth'] {
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
