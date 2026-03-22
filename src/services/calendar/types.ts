export interface ICreateCalendarEventParams {
    summary: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    attendees?: string[];
}

export interface ICalendarEvent {
    id: string;
    summary: string;
    description: string;
    location: string;
    start: string;
    end: string;
    status: string;
    organizer: string;
    attendees: string[];
    htmlLink: string;
}
