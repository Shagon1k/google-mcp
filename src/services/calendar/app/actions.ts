import type { ICalendarEvent, ICreateCalendarEventParams } from '../types.js';
import { CALENDAR_ID } from '../config.js';
import { getCalendarClient } from './helpers/getClient.js';
import { normalizeCalendarEvent } from './helpers/normalizers.js';

export async function createCalendarEvent(params: ICreateCalendarEventParams): Promise<ICalendarEvent> {
    const calendar = getCalendarClient();

    const response = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: {
            summary: params.summary,
            description: params.description,
            location: params.location,
            start: { dateTime: params.start },
            end: { dateTime: params.end },
            attendees: params.attendees?.map((email) => ({ email })),
        },
    });

    return normalizeCalendarEvent(response.data);
}
