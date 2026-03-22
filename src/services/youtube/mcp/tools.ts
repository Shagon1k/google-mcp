import { z } from 'zod';
import { searchVideos } from '../app/queries.js';
import type { IYouTubeVideo, IVideoDuration } from '../types.js';

export const youtubeTools = [
    {
        name: 'search_youtube_videos',
        description: `Search YouTube videos by query.
           Returns a list of videos with fields:
            - id: string (YouTube video ID)
            - title: string
            - description: string (short snippet)
            - channelId: string
            - channelTitle: string
            - publishedAt: string (ISO 8601)
            - thumbnailUrl: string
            - url: string (full YouTube watch URL)
        `,
        inputSchema: {
            query: z.string().min(1)
                .describe('Search query string'),
            maxResults: z.number().int().min(1).max(50).default(10)
                .describe('Maximum number of results to return (1–50)'),
            videoDuration: z.enum(['any', 'short', 'medium', 'long']).default('any')
                .describe('Filter by duration: short (<4 min), medium (4–20 min), long (>20 min), any (no filter)'),
        },
        handler: async ({ query, maxResults, videoDuration }: { query: string; maxResults: number; videoDuration: IVideoDuration }) => {
            return await searchVideos(query, maxResults, videoDuration);
        },
        formatOutput: (videos: IYouTubeVideo[]) => {
            if (videos.length === 0) {
                return {
                    content: [{ type: 'text', text: 'No videos found.' }],
                    structuredContent: { videos: [] },
                };
            }

            const formatted = videos.map((v, i) =>
                `--- Video ${i + 1} ---\n` +
                `Title:     ${v.title}\n` +
                `Channel:   ${v.channelTitle}\n` +
                `Published: ${v.publishedAt}\n` +
                `URL:       ${v.url}\n` +
                `Description: ${v.description || '—'}`
            ).join('\n\n');

            return {
                content: [{ type: 'text', text: formatted }],
                structuredContent: { videos },
            };
        },
    },
];
