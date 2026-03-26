import type { ICalendarEvent } from '../types.js';
import { CALENDAR_IDS } from '../config.js';
import { getCalendarClient } from './helpers/getClient.js';
import { normalizeCalendarEvent } from './helpers/normalizers.js';

export async function getCalendarEvents(
    fromDate: string,
    toDate: string,
): Promise<ICalendarEvent[]> {
    const calendar = getCalendarClient();

    const responses = await Promise.all(
        CALENDAR_IDS.map((calendarId) =>
            calendar.events.list({
                calendarId,
                timeMin: fromDate,
                timeMax: toDate,
                singleEvents: true,
                orderBy: 'startTime',
            })
        )
    );

    return responses
        .flatMap((response) => response.data.items ?? [])
        .map(normalizeCalendarEvent)
        .sort((a, b) => a.start.localeCompare(b.start));
}
