import { gmail_v1 } from 'googleapis';
import type { IEmail, IEmailSummary } from '../../types.js';
import { MAX_BODY_LENGTH } from '../../config.js';
import { decodeBody } from './utils.js';

function getHeaderValue(headers: gmail_v1.Schema$MessagePartHeader[], name: string): string {
    return headers.find((header) => header.name?.toLowerCase() === name)?.value ?? '';
}

export function normalizeEmail(message: gmail_v1.Schema$Message): IEmail {
    const headers = message.payload?.headers ?? [];
    const snippet = message.snippet ?? '';
    const body = decodeBody(message.payload)?.slice(0, MAX_BODY_LENGTH) || snippet;

    return {
        id: message.id ?? '',
        subject: getHeaderValue(headers, 'subject') || '(no subject)',
        from: getHeaderValue(headers, 'from'),
        date: getHeaderValue(headers, 'date'),
        labels: message.labelIds ?? [],
        snippet,
        body,
    };
}

export function normalizeEmailSummary(message: gmail_v1.Schema$Message): IEmailSummary {
    return {
        id: message.id ?? '',
        date: message.internalDate ? new Date(Number(message.internalDate)).toISOString() : '',
        labels: message.labelIds ?? [],
    };
}
