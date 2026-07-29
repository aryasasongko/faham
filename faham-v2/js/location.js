/* ============================================================================
   LocationService — the only module that touches navigator.geolocation.
   ----------------------------------------------------------------------------
   Both the qibla compass and the prayer-time engine read the resolved position
   from `state.location`; neither asks the browser itself. That keeps one
   permission prompt per session and, more usefully, means swapping in
   Capacitor's Geolocation plugin for a Play Store build is a change to this one
   file rather than to every feature that needs a position.

   Privacy: a single position request, never a watch. Coordinates stay in memory
   unless the user explicitly turns on "remember this location", and even then
   only a value rounded to roughly a kilometre is written (see js/state.js).
   Coordinates are never logged and never sent anywhere — the prayer times are
   computed on the device.
   ========================================================================== */

import { state, setLocation, setLocationStatus } from './state.js';
import { t } from './i18n.js';

const OPTIONS = {
  enableHighAccuracy: false,   // a kilometre is ample for qibla and prayer times
  timeout: 12000,
  maximumAge: 10 * 60 * 1000   // a ten-minute-old fix is fine; avoids re-prompting
};

/** Fallback list for a refused or unavailable permission. */
export const CITIES = [
  { n: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { n: 'Bandung', lat: -6.9175, lng: 107.6191 },
  { n: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { n: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { n: 'Medan', lat: 3.5952, lng: 98.6722 },
  { n: 'Makassar', lat: -5.1477, lng: 119.4327 },
  { n: 'Denpasar', lat: -8.6705, lng: 115.2126 }
];

export function isSupported() {
  return 'geolocation' in navigator;
}

/** True once a usable position exists, from any source. */
export function hasLocation() {
  return !!state.location;
}

/**
 * Ask the device once. Resolves with the location or with null; it never
 * rejects, so no caller needs a try/catch to stay alive.
 */
export function request() {
  if (!isSupported()) {
    setLocationStatus('unsupported');
    return Promise.resolve(null);
  }
  /* A request is already in flight — don't stack a second prompt on it. */
  if (state.locationStatus === 'locating') return Promise.resolve(null);
  setLocationStatus('locating');

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value, status) => {
      if (settled) return;
      settled = true;
      setLocationStatus(status);
      resolve(value);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: null,
          source: 'device'
        };
        setLocation(loc);
        finish(loc, 'ready');
      },
      (err) => {
        /* Browser exception text is never shown to the user. */
        let status = 'failed';
        if (err && err.code === 1) status = 'denied';
        else if (err && err.code === 3) status = 'timeout';
        finish(null, status);
      },
      OPTIONS
    );
  });
}

/** Manual fallback: a named city, so the app is usable without permission. */
export function useCity(index) {
  const city = CITIES[index];
  if (!city) return null;
  const loc = { lat: city.lat, lng: city.lng, label: city.n, source: 'city' };
  setLocation(loc);
  setLocationStatus('ready');
  return loc;
}

/** A friendly sentence for the current failure, or '' when there is none. */
export function statusMessage() {
  switch (state.locationStatus) {
    case 'unsupported': return t('loc_unsupported');
    case 'denied': return t('loc_denied');
    case 'timeout': return t('loc_timeout');
    case 'failed': return t('loc_failed');
    case 'locating': return t('pt_locating');
    default: return '';
  }
}

/** What to print for "where these times are for". */
export function locationLabel() {
  const loc = state.location;
  if (!loc) return '';
  if (loc.label) return loc.label;
  const ns = loc.lat >= 0 ? 'N' : 'S';
  const ew = loc.lng >= 0 ? 'E' : 'W';
  return Math.abs(loc.lat).toFixed(1) + '° ' + ns + ', ' + Math.abs(loc.lng).toFixed(1) + '° ' + ew;
}
