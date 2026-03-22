import { calendar_v3 } from 'googleapis';
import type { ICalendarEvent } from '../../types.js';

export function normalizeCalendarEvent(event: calendar_v3.Schema$Event): ICalendarEvent {
    return {
        id: event.id ?? '',
        summary: event.summary ?? '(no title)',
        description: event.description ?? '',
        location: event.location ?? '',
        start: event.start?.dateTime ?? event.start?.date ?? '',
        end: event.end?.dateTime ?? event.end?.date ?? '',
        status: event.status ?? '',
        organizer: event.organizer?.email ?? '',
        attendees: (event.attendees ?? []).map((a) => a.email ?? '').filter(Boolean),
        htmlLink: event.htmlLink ?? '',
    };
}
