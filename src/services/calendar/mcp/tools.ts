import { z } from 'zod';
import { getCalendarEvents } from '../app/queries.js';
import { createCalendarEvent } from '../app/actions.js';
import type { ICalendarEvent } from '../types.js';

export const calendarTools = [
    {
        name: 'get_calendar_events',
        description: `Fetch Google Calendar events within a given time range.
           Returns a list of events with fields:
            - id: string (Calendar event ID)
            - summary: string (event title)
            - description: string
            - location: string
            - start: string (ISO 8601 datetime or date)
            - end: string (ISO 8601 datetime or date)
            - status: string (confirmed, tentative, cancelled)
            - organizer: string (organizer email)
            - attendees: string[] (attendee emails)
            - htmlLink: string (link to the event in Google Calendar)
        `,
        inputSchema: {
            fromDate: z.iso.datetime({ offset: true })
                .describe('Start of the time range (ISO 8601, e.g. 2026-03-01T00:00:00Z)'),
            toDate: z.iso.datetime({ offset: true })
                .describe('End of the time range (ISO 8601, e.g. 2026-03-31T23:59:59Z)'),
        },
        handler: async ({ fromDate, toDate }: { fromDate: string; toDate: string }) => {
            return await getCalendarEvents(fromDate, toDate);
        },
        formatOutput: (events: ICalendarEvent[]) => {
            if (events.length === 0) {
                return {
                    content: [{ type: 'text', text: 'No events found in the given time range.' }],
                    structuredContent: { events: [] },
                };
            }

            const formatted = events.map((e, i) =>
                `--- Event ${i + 1} ---\n` +
                `Summary:   ${e.summary}\n` +
                `Start:     ${e.start}\n` +
                `End:       ${e.end}\n` +
                `Location:  ${e.location || '—'}\n` +
                `Organizer: ${e.organizer || '—'}\n` +
                `Attendees: ${e.attendees.length > 0 ? e.attendees.join(', ') : '—'}\n` +
                `Status:    ${e.status}\n` +
                `Link:      ${e.htmlLink}`
            ).join('\n\n');

            return {
                content: [{ type: 'text', text: formatted }],
                structuredContent: { events },
            };
        },
    },
    {
        name: 'create_calendar_event',
        description: `Create a new event in Google Calendar.
           Returns the created event with fields:
            - id: string (Calendar event ID)
            - summary: string (event title)
            - description: string
            - location: string
            - start: string (ISO 8601 datetime)
            - end: string (ISO 8601 datetime)
            - status: string
            - organizer: string
            - attendees: string[]
            - htmlLink: string (link to the event in Google Calendar)
        `,
        inputSchema: {
            summary: z.string().min(1)
                .describe('Title of the event'),
            start: z.iso.datetime({ offset: true })
                .describe('Event start time (ISO 8601, e.g. 2026-04-01T10:00:00Z)'),
            end: z.iso.datetime({ offset: true })
                .describe('Event end time (ISO 8601, e.g. 2026-04-01T11:00:00Z)'),
            description: z.string().optional()
                .describe('Optional event description'),
            location: z.string().optional()
                .describe('Optional event location'),
            attendees: z.array(z.string().email()).optional()
                .describe('Optional list of attendee email addresses'),
        },
        handler: async (params: {
            summary: string;
            start: string;
            end: string;
            description?: string;
            location?: string;
            attendees?: string[];
        }) => {
            return await createCalendarEvent(params);
        },
        formatOutput: (event: ICalendarEvent) => {
            const text =
                `Event created successfully!
` +
                `Summary:   ${event.summary}\n` +
                `Start:     ${event.start}\n` +
                `End:       ${event.end}\n` +
                `Location:  ${event.location || '—'}\n` +
                `Attendees: ${event.attendees.length > 0 ? event.attendees.join(', ') : '—'}\n` +
                `Link:      ${event.htmlLink}`;

            return {
                content: [{ type: 'text', text }],
                structuredContent: { event },
            };
        },
    },
];
