import { google, gmail_v1 } from 'googleapis';
import { createOAuthClient } from '../../../../shared/auth.js';

export function getGmailClient(): gmail_v1.Gmail {
    const auth = createOAuthClient();
    return google.gmail({ version: 'v1', auth });
}
