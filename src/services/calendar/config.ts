import 'dotenv/config';
export const PRIMARY_CALENDAR_ID = process.env.GOOGLE_PRIMARY_CALENDAR_ID || 'primary'
export const CALENDAR_IDS = (process.env.GOOGLE_CALENDAR_IDS || 'primary').split(',').map(id => id.trim());
