export const dailyBriefingPrompt = {
    name: 'daily-briefing',
    title: 'Daily Briefing',
    description: "Checks user's unread emails and today's calendar events, then provides a concise summary.",
    handler: () => ({
        messages: [
            {
                role: 'user' as const,
                content: {
                    type: 'text' as const,
                    text: `
                        Check my unread emails and today's calendar events.

                        For emails:
                        - List each unread email with: sender, subject, and a summary
                        - Flag any that seem urgent or require a response

                        For calendar:
                        - List each event today with: time, title, and attendees (if any)
                        - Highlight any conflicts or back-to-back meetings

                        Present the summary in two clearly labeled sections: "Emails" and "Calendar".
                        Keep it concise. At the end, ask me if I'd like to mark the unread emails as read and/or move them to trash.`,
                },
            },
        ],
    }),
};
