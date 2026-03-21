import { z } from 'zod';
import { getEmails, getEmailSummaries } from '../app/queries.js';
import { markEmailsAsRead, archiveEmails, trashEmails } from '../app/actions.js';
import type { IEmail, IEmailSummary, IEmailBatchActionResult } from '../types.js';

const mailboxTypeSchema = z.enum(['INBOX', 'UNREAD', 'SENT', 'PROMOTIONS', 'SOCIAL', 'UPDATES']);

export const gmailTools = [
    {
        name: 'get_emails',
        description: `Fetch latest emails from Gmail inbox.
           Returns a list of emails with fields:
            - id: string (Gmail message ID)
            - from: string (sender name and email)
            - subject: string
            - date: string
            - labels: string[] (email labels like INBOX, UNREAD, SENT, PROMOTIONS, SOCIAL, UPDATES)
            - snippet: string (short preview)
            - body: string (first 500 chars of email body)
    `,
        inputSchema: {
            type: mailboxTypeSchema.default('UNREAD')
                .describe('The mailbox to fetch emails from'),
            maxCount: z.number().min(1).max(50).default(10)
                .describe('How many emails to fetch'),
        },
        handler: async ({ type, maxCount }: { type: string; maxCount: number }) => {
            return await getEmails(type as any, maxCount);
        },
        formatOutput: (emails: IEmail[]) => {
            if (emails.length === 0) {
                return { content: [{ type: 'text', text: 'No emails found.' }], structuredContent: { emails: [] } };
            }

            const formatted = emails.map((e, i) =>
                `--- Email ${i + 1} ---\n` +
                `From:    ${e.from}\n` +
                `Subject: ${e.subject}\n` +
                `Date:    ${e.date}\n` +
                `Labels:  ${e.labels.join(', ')}\n` +
                `Snippet: ${e.snippet}\n` +
                `Body:    ${e.body}`
            ).join('\n\n');

            return { content: [{ type: 'text', text: formatted }], structuredContent: { emails } };
        },
    },
    {
        name: 'get_email_summaries',
        description: `Fetch lightweight email summaries for bulk actions.
           Returns only:
            - id: string (Gmail message ID)
            - date: string (ISO timestamp based on Gmail internal date)
            - labels: string[] (email labels like INBOX, UNREAD, SENT, PROMOTIONS, SOCIAL, UPDATES)
    `,
        inputSchema: {
            type: mailboxTypeSchema.default('UNREAD')
                .describe('The mailbox to fetch email summaries from'),
            maxCount: z.number().min(1).max(150).default(25)
                .describe('How many email summaries to fetch'),
        },
        handler: async ({ type, maxCount }: { type: string; maxCount: number }) => {
            return await getEmailSummaries(type as any, maxCount);
        },
        formatOutput: (emails: IEmailSummary[]) => {
            if (emails.length === 0) {
                return {
                    content: [{ type: 'text', text: 'No email summaries found.' }],
                    structuredContent: { emails: [] },
                };
            }

            const formatted = emails.map((email, index) =>
                `--- Email ${index + 1} ---\n` +
                `ID:     ${email.id}\n` +
                `Date:   ${email.date}\n` +
                `Labels: ${email.labels.join(', ')}`
            ).join('\n\n');

            return {
                content: [{ type: 'text', text: formatted }],
                structuredContent: { emails },
            };
        },
    },
    {
        name: 'mark_emails_as_read',
        description: 'Mark emails as read by Gmail message IDs.',
        inputSchema: {
            emailIds: z.array(z.string().min(1)).min(1).max(100)
                .describe('List of Gmail message IDs to mark as read'),
        },
        handler: async ({ emailIds }: { emailIds: string[] }) => {
            return await markEmailsAsRead(emailIds);
        },
        formatOutput: (result: IEmailBatchActionResult) => {
            const summary =
                `Marked as read: ${result.processedIds.length}, ` +
                `Failed: ${result.failed.length}`;

            return {
                content: [{ type: 'text', text: summary }],
                structuredContent: {
                    processedIds: result.processedIds,
                    failed: result.failed,
                },
            };
        },
    },
    {
        name: 'archive_emails',
        description: 'Archive emails by Gmail message IDs.',
        inputSchema: {
            emailIds: z.array(z.string().min(1)).min(1).max(100)
                .describe('List of Gmail message IDs to archive'),
        },
        handler: async ({ emailIds }: { emailIds: string[] }) => {
            return await archiveEmails(emailIds);
        },
        formatOutput: (result: IEmailBatchActionResult) => {
            const summary =
                `Archived: ${result.processedIds.length}, ` +
                `Failed: ${result.failed.length}`;

            return {
                content: [{ type: 'text', text: summary }],
                structuredContent: {
                    processedIds: result.processedIds,
                    failed: result.failed,
                },
            };
        },
    },
    {
        name: 'trash_emails',
        description: 'Move emails to trash by Gmail message IDs.',
        inputSchema: {
            emailIds: z.array(z.string().min(1)).min(1).max(100)
                .describe('List of Gmail message IDs to move to trash'),
        },
        handler: async ({ emailIds }: { emailIds: string[] }) => {
            return await trashEmails(emailIds);
        },
        formatOutput: (result: IEmailBatchActionResult) => {
            const summary =
                `Moved to trash: ${result.processedIds.length}, ` +
                `Failed: ${result.failed.length}`;

            return {
                content: [{ type: 'text', text: summary }],
                structuredContent: {
                    processedIds: result.processedIds,
                    failed: result.failed,
                },
            };
        },
    },
];
