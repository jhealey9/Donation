// Push a GTM-compatible event to window.dataLayer.
// All event names are configurable via the form config's analytics keys.
export function pushEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}
