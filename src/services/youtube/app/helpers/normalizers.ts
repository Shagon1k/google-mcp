import { youtube_v3 } from 'googleapis';
import type { IYouTubeVideo } from '../../types.js';

export function normalizeYouTubeVideo(item: youtube_v3.Schema$SearchResult): IYouTubeVideo {
    const videoId = item.id?.videoId ?? '';

    return {
        id: videoId,
        title: item.snippet?.title ?? '(no title)',
        description: item.snippet?.description ?? '',
        channelId: item.snippet?.channelId ?? '',
        channelTitle: item.snippet?.channelTitle ?? '',
        publishedAt: item.snippet?.publishedAt ?? '',
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
    };
}
