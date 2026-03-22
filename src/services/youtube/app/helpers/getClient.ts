import { google, youtube_v3 } from 'googleapis';
import { createOAuthClient } from '../../../../shared/auth.js';

export function getYouTubeClient(): youtube_v3.Youtube {
    const auth = createOAuthClient();
    return google.youtube({ version: 'v3', auth });
}
