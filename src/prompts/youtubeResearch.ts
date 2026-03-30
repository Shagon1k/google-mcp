export const youtubeResearchPrompt = {
    name: 'youtube-research',
    title: 'YouTube Research',
    description: 'Search YouTube videos on a topic and present the most relevant results with summaries.',
    handler: () => ({
        messages: [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: `
                        Help me research a topic on YouTube.

                        First, ask me what topic I want to learn about.

                        Then, search YouTube for relevant videos. Consider searching with different duration filters if appropriate:
                        - Short videos (<4 min) for quick overviews
                        - Medium videos (4-20 min) for detailed explanations
                        - Long videos (>20 min) for in-depth tutorials

                        Present the top results with:
                        - Video titles
                        - Channel names
                        - Brief descriptions
                        - Video duration and when published

                        Finally, ask if I'd like to explore related topics or refine the search.`,
                },
            },
        ],
    }),
};
