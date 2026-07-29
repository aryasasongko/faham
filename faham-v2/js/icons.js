/* Inline SVG icons.
   A whole icon library for eight glyphs would be a poor trade on a phone, so
   these are hand-written paths. Every one inherits `currentColor`, which is why
   they work unchanged in light and dark mode. */

import { esc } from './dom.js';

export const ICONS = {
  today: '<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>',
  prayer: '<circle cx="12" cy="5.5" r="2.4"/><path d="M12 8v6M9 19l3-5 3 5M8 11h8"/>',
  qibla: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L10.5 10.5L8.5 15.5L13.5 13.5Z"/>',
  duas: '<path d="M8 20V11a2 2 0 0 1 4 0M12 20v-9a2 2 0 0 1 4 0v9M8 14c-1.5 0-2.5 1-2.5 2.5S6.5 20 8 20M16 14c1.5 0 2.5 1 2.5 2.5S17.5 20 16 20"/>',
  read: '<path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5zM20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5z"/>',
  ask: '<path d="M9.2 9a2.8 2.8 0 1 1 3.8 2.6c-.8.3-1.3 1-1.3 1.9v.4"/><circle cx="11.8" cy="17.6" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="9"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  location: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>'
};

export function icon(key, className) {
  if (!ICONS[key]) return '';
  return '<svg class="ic ' + esc(className || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    ICONS[key] + '</svg>';
}
