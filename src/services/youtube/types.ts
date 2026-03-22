export interface IYouTubeVideo {
    id: string;
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnailUrl: string;
    url: string;
}

export type IVideoDuration = 'any' | 'short' | 'medium' | 'long';
