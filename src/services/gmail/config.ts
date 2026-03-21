import type { IEmailMailbox } from './types.js';

export const GMAIL_USER_ID = 'me';
export const MAX_BODY_LENGTH = 700;

export const EMAIL_CONFIG_BY_MAILBOX: Record<IEmailMailbox, { labelIds: string[], q?: string }> = {
    INBOX: {
        labelIds: ['INBOX'],
        q: 'category:primary'
    },
    UNREAD: {
        labelIds: ['UNREAD', 'INBOX'],
        q: 'category:primary'
    },
    PROMOTIONS: {
        labelIds: ['INBOX'],
        q: 'category:promotions'
    },
    SOCIAL: {
        labelIds: ['INBOX'],
        q: 'category:social'
    },
    UPDATES: {
        labelIds: ['INBOX'],
        q: 'category:updates'
    },
    SENT: { labelIds: ['SENT'] },
};
