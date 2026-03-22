import { gmail_v1 } from 'googleapis';
import type { IEmailBatchActionResult } from '../types.js';
import { GMAIL_USER_ID } from '../config.js';
import { getGmailClient } from './helpers/getClient.js';

async function markEmailAsRead(gmail: gmail_v1.Gmail, id: string): Promise<void> {
    await gmail.users.messages.modify({
        userId: GMAIL_USER_ID,
        id,
        requestBody: {
            removeLabelIds: ['UNREAD'],
        },
    });
}

async function archiveEmail(gmail: gmail_v1.Gmail, id: string): Promise<void> {
    await gmail.users.messages.modify({
        userId: GMAIL_USER_ID,
        id,
        requestBody: {
            removeLabelIds: ['INBOX', 'UNREAD'],
        },
    });
}

async function moveEmailToTrash(gmail: gmail_v1.Gmail, id: string): Promise<void> {
    await gmail.users.messages.trash({
        userId: GMAIL_USER_ID,
        id,
    });
}

async function runEmailBatchAction(
    emailIds: string[],
    action: (gmail: gmail_v1.Gmail, id: string) => Promise<void>
): Promise<IEmailBatchActionResult> {
    const gmail = getGmailClient();
    const uniqueIds = Array.from(new Set(emailIds.filter(Boolean)));

    if (uniqueIds.length === 0) {
        return { processedIds: [], failed: [] };
    }

    const results = await Promise.allSettled(
        uniqueIds.map(async (id) => {
            await action(gmail, id);
            return id;
        })
    );

    const processedIds: string[] = [];
    const failed: IEmailBatchActionResult['failed'] = [];

    results.forEach((result, index) => {
        const id = uniqueIds[index];
        if (result.status === 'fulfilled') {
            processedIds.push(id);
            return;
        }

        const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
        failed.push({ id, error: errorMessage });
    });

    return { processedIds, failed };
}

export async function markEmailsAsRead(emailIds: string[]): Promise<IEmailBatchActionResult> {
    return runEmailBatchAction(emailIds, markEmailAsRead);
}

export async function archiveEmails(emailIds: string[]): Promise<IEmailBatchActionResult> {
    return runEmailBatchAction(emailIds, archiveEmail);
}

export async function trashEmails(emailIds: string[]): Promise<IEmailBatchActionResult> {
    return runEmailBatchAction(emailIds, moveEmailToTrash);
}
