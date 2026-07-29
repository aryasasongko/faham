/* ============================================================================
   Qibla — bearing maths and the compass feed.
   ----------------------------------------------------------------------------
   Carried over from the original implementation, with two changes: the position
   now comes from LocationService (so qibla and prayer times share one
   permission prompt) and the device-orientation permission is kept separate
   from the location permission, because they are separate grants and either can
   fail without the other.

   Rendering lives in js/views/qibla.js. This file owns only the numbers.
   ========================================================================== */

import { P } from './i18n.js';

export const KAABA = { lat: 21.4225, lng: 39.8262 };

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

/** Initial great-circle bearing from a position to the Kaaba, degrees from north. */
export function bearingTo(lat, lng) {
  const p1 = toRad(lat);
  const p2 = toRad(KAABA.lat);
  const dl = toRad(KAABA.lng - lng);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle distance to the Kaaba in whole kilometres. */
export function distanceKm(lat, lng) {
  const R = 6371;
  const p1 = toRad(lat);
  const p2 = toRad(KAABA.lat);
  const dp = toRad(KAABA.lat - lat);
  const dl = toRad(KAABA.lng - lng);
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function compassPoint(deg) {
  const pts = P(
    ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
    ['utara', 'timur laut', 'timur', 'tenggara', 'selatan', 'barat daya', 'barat', 'barat laut']
  );
  return pts[Math.round(deg / 45) % 8];
}

/* ---- the live compass --------------------------------------------------- */

export const compass = {
  heading: null,
  /* idle → live | none | denied. Never blocks anything else in the app. */
  status: 'idle'
};

const smooth = { x: 0, y: 0, has: false };
let attached = false;
let frame = null;
let onUpdate = null;
let probeTimer = null;

function screenAngle() {
  if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
    return window.screen.orientation.angle;
  }
  if (typeof window.orientation === 'number') return window.orientation;
  return 0;
}

/** Circular low-pass, so raw magnetometer noise does not make the needle buzz. */
function feed(rawHeading) {
  const a = toRad(rawHeading);
  if (!smooth.has) {
    smooth.x = Math.cos(a); smooth.y = Math.sin(a); smooth.has = true;
  } else {
    const k = 0.15;
    smooth.x += (Math.cos(a) - smooth.x) * k;
    smooth.y += (Math.sin(a) - smooth.y) * k;
  }
  compass.heading = (toDeg(Math.atan2(smooth.y, smooth.x)) + 360) % 360;

  /* Coalesce to one repaint per frame — orientation events fire far faster
     than the screen refreshes. */
  if (frame === null) {
    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (onUpdate) onUpdate();
    });
  }
}

function handleOrientation(e) {
  let h = null;
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    h = e.webkitCompassHeading;                       // iOS reports true heading
  } else if (typeof e.alpha === 'number' && !isNaN(e.alpha) &&
             (e.absolute || e.type === 'deviceorientationabsolute')) {
    h = (360 - e.alpha) % 360;                        // Android absolute orientation
  }
  if (h === null) return;
  h = (h + screenAngle() + 360) % 360;                // compensate for landscape
  if (compass.status !== 'live') {
    compass.status = 'live';
    if (onUpdate) onUpdate(true);
  }
  feed(h);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener('deviceorientationabsolute', handleOrientation, true);
  window.addEventListener('deviceorientation', handleOrientation, true);

  /* If no reading arrives, say so rather than leaving a dead dial spinning. */
  window.clearTimeout(probeTimer);
  probeTimer = window.setTimeout(() => {
    if (compass.status !== 'live') {
      compass.status = 'none';
      if (onUpdate) onUpdate(true);
    }
  }, 2500);
}

/**
 * Ask for motion access where the platform requires it (iOS), then attach.
 * A refusal degrades to a static needle showing the bearing from north; it is
 * never allowed to break the page.
 */
export function startCompass(updateCallback) {
  onUpdate = updateCallback || onUpdate;
  const DOE = window.DeviceOrientationEvent;
  if (!DOE) { compass.status = 'none'; if (onUpdate) onUpdate(true); return; }

  if (typeof DOE.requestPermission === 'function') {
    DOE.requestPermission()
      .then((result) => {
        if (result === 'granted') { attach(); return; }
        compass.status = 'denied';
        if (onUpdate) onUpdate(true);
      })
      .catch(() => {
        compass.status = 'denied';
        if (onUpdate) onUpdate(true);
      });
    return;
  }
  attach();
}

export function stopCompass() {
  if (!attached) return;
  window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
  window.removeEventListener('deviceorientation', handleOrientation, true);
  window.clearTimeout(probeTimer);
  if (frame !== null) { window.cancelAnimationFrame(frame); frame = null; }
  attached = false;
  smooth.has = false;
  compass.heading = null;
  compass.status = 'idle';
}
