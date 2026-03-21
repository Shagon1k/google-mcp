import { gmail_v1 } from 'googleapis';
import type { IEmailMailbox, IEmail, IEmailSummary } from '../types.js';
import { GMAIL_USER_ID, EMAIL_CONFIG_BY_MAILBOX } from '../config.js';
import { getClient } from '../../../shared/getClient.js';
import { normalizeEmail, normalizeEmailSummary } from './helpers/normalizers.js';

async function getMessageIds(
    gmail: gmail_v1.Gmail,
    mailbox: IEmailMailbox,
    maxCount: number
): Promise<string[]> {
    const response = await gmail.users.messages.list({
        userId: GMAIL_USER_ID,
        maxResults: maxCount,
        ...EMAIL_CONFIG_BY_MAILBOX[mailbox]
    });

    return (response.data.messages ?? [])
        .map((message) => message.id)
        .filter(Boolean) as string[];
}

async function getMessageById(gmail: gmail_v1.Gmail, id: string): Promise<gmail_v1.Schema$Message> {
    const response = await gmail.users.messages.get({
        userId: GMAIL_USER_ID,
        id,
        format: 'full',
        fields: 'id,labelIds,snippet,payload(headers(name,value),mimeType,body(data),parts)'
    });

    return response.data;
}

async function getMessageSummaryById(gmail: gmail_v1.Gmail, id: string): Promise<gmail_v1.Schema$Message> {
    const response = await gmail.users.messages.get({
        userId: GMAIL_USER_ID,
        id,
        format: 'minimal',
        fields: 'id,labelIds,internalDate'
    });

    return response.data;
}

export async function getEmails(mailbox: IEmailMailbox, maxCount: number = 10): Promise<IEmail[]> {
    const gmail = getClient();
    const messageIds = await getMessageIds(gmail, mailbox, maxCount);

    if (messageIds.length === 0) return [];

    return Promise.all(
        messageIds.map(async (id) => {
            const message = await getMessageById(gmail, id);
            return normalizeEmail(message);
        })
    );
}

export async function getEmailSummaries(
    mailbox: IEmailMailbox,
    maxCount: number = 10
): Promise<IEmailSummary[]> {
    const gmail = getClient();
    const messageIds = await getMessageIds(gmail, mailbox, maxCount);

    if (messageIds.length === 0) return [];

    return Promise.all(
        messageIds.map(async (id) => {
            const message = await getMessageSummaryById(gmail, id);
            return normalizeEmailSummary(message);
        })
    );
}
