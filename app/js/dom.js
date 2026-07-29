/* Tiny DOM helpers. Kept deliberately small — this is not a framework. */

export function $(id) { return document.getElementById(id); }

export function qs(sel, root) { return (root || document).querySelector(sel); }

export function qsa(sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}

/** Escape a string that is about to be interpolated into markup. */
export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape for use inside a double-quoted HTML attribute. */
export function attr(s) { return esc(s); }

/** Write text without going through innerHTML. */
export function setText(el, text) {
  if (el) el.textContent = text == null ? '' : String(text);
}

/** Replace an element's children with parsed markup we generated ourselves. */
export function setHTML(el, html) {
  if (el) el.innerHTML = html;
}

/**
 * One delegated listener per container instead of one per row. Prevents the
 * listener leak that comes with re-rendering a list on every language change.
 */
export function delegate(root, selector, type, handler) {
  if (!root) return;
  root.addEventListener(type, (e) => {
    const match = e.target.closest(selector);
    if (match && root.contains(match)) handler(e, match);
  });
}

/** A short-lived polite announcement for screen readers. */
export function announce(message) {
  const region = $('liveRegion');
  if (!region) return;
  region.textContent = '';
  window.setTimeout(() => { region.textContent = message; }, 30);
}

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Subtle haptic tick where the platform offers one. Never a dependency. */
export function tick(pattern) {
  if (prefersReducedMotion()) return;
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern || 8); } catch (e) { /* ignore */ }
  }
}
