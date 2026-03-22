import type { IYouTubeVideo, IVideoDuration } from '../types.js';
import { MAX_SEARCH_RESULTS } from '../config.js';
import { getYouTubeClient } from './helpers/getClient.js';
import { normalizeYouTubeVideo } from './helpers/normalizers.js';

export async function searchVideos(
    query: string,
    maxResults: number = 10,
    videoDuration: IVideoDuration = 'any'
): Promise<IYouTubeVideo[]> {
    const youtube = getYouTubeClient();

    const response = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: Math.min(maxResults, MAX_SEARCH_RESULTS),
        videoDuration,
    });

    return (response.data.items ?? []).map(normalizeYouTubeVideo);
}
