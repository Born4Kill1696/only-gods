/**
 * OG SCRIM SYSTEM - Default Configuration
 * Acts as a fallback if no event is saved in localStorage.
 * Replace the ISO string to set a default scrim date.
 */
window.OG_SCRIM_CONFIG = {
    name: "Weekly Clan Scrim #12",
    // Format: YYYY-MM-DDTHH:mm:ss.sssZ (ISO 8601)
    isoTimestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() 
};