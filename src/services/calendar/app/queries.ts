import type { ICalendarEvent } from '../types.js';
import { CALENDAR_ID } from '../config.js';
import { getCalendarClient } from './helpers/getClient.js';
import { normalizeCalendarEvent } from './helpers/normalizers.js';

export async function getCalendarEvents(
    fromDate: string,
    toDate: string
): Promise<ICalendarEvent[]> {
    const calendar = getCalendarClient();

    const response = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: fromDate,
        timeMax: toDate,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return (response.data.items ?? []).map(normalizeCalendarEvent);
}
