import { google, calendar_v3 } from 'googleapis';
import { createOAuthClient } from '../../../../shared/auth.js';

export function getCalendarClient(): calendar_v3.Calendar {
    const auth = createOAuthClient();
    return google.calendar({ version: 'v3', auth });
}
