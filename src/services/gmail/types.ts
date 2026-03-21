export type IEmailMailbox = 'INBOX' | 'UNREAD' | 'SENT' | 'PROMOTIONS' | 'SOCIAL' | 'UPDATES';

export interface IEmail {
    id: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
    body: string;
    labels: string[];
}

export interface IEmailSummary {
    id: string;
    date: string;
    labels: string[];
}

export interface IEmailBatchActionResult {
    processedIds: string[];
    failed: Array<{
        id: string;
        error: string;
    }>;
}
