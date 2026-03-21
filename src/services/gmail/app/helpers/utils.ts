import { gmail_v1 } from 'googleapis';
import { convert } from 'html-to-text';

const MIME_TEXT_PLAIN = 'text/plain';
const MIME_TEXT_HTML = 'text/html';

function sanitizeHtmlToText(html: string): string {
    return convert(html, {
        selectors: [
            { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
            { selector: 'img', format: 'inline' },
        ],
        wordwrap: false,
        preserveNewlines: true,
    }).trim();
}

function decodeBase64(data?: string | null): string | null {
    if (!data) return null;

    return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function decodePartBody(part?: gmail_v1.Schema$MessagePart): string | null {
    return decodeBase64(part?.body?.data);
}

function findPartByMimeType(
    payload: gmail_v1.Schema$MessagePart,
    mimeType: string
): gmail_v1.Schema$MessagePart | undefined {
    if (payload.mimeType === mimeType) {
        return payload;
    }

    for (const part of payload.parts ?? []) {
        const matchedPart = findPartByMimeType(part, mimeType);
        if (matchedPart) {
            return matchedPart;
        }
    }

    return undefined;
}

export function decodeBody(payload?: gmail_v1.Schema$MessagePart | null): string | null {
    if (!payload) return null;

    const inlineBody = decodePartBody(payload);
    if (inlineBody) {
        return payload.mimeType === MIME_TEXT_HTML ? sanitizeHtmlToText(inlineBody) : inlineBody;
    }

    const textPart = findPartByMimeType(payload, MIME_TEXT_PLAIN);
    const textBody = decodePartBody(textPart);
    if (textBody) return textBody;

    const htmlPart = findPartByMimeType(payload, MIME_TEXT_HTML);
    const htmlBody = decodePartBody(htmlPart);
    if (htmlBody) return sanitizeHtmlToText(htmlBody);

    return null;
}
