import { FRONTEND_URL } from '../config.js';

// Inject open pixel and wrap links for click tracking
export function injectTracking(html: string, jobTrackingId: string, frontendUrl: string): string {
  const pixel = `<img src="${frontendUrl}/api/track/o/${jobTrackingId}" width="1" height="1" alt="" style="display:none" />`;

  // Wrap all <a href="..."> links for click tracking, except unsubscribe and already-tracked links
  const wrappedHtml = html.replace(
    /(<a\s[^>]*href=)(["'])([^"']+)\2/gi,
    (match, prefix, quote, url) => {
      if (url.includes('/unsubscribe') || url.includes('/track/')) return match;
      const encoded = encodeURIComponent(url);
      const trackUrl = `${frontendUrl}/api/track/c/${jobTrackingId}?u=${encoded}`;
      return `${prefix}${quote}${trackUrl}${quote}`;
    }
  );

  // Insert pixel before </body>, or append at end
  if (wrappedHtml.includes('</body>')) {
    return wrappedHtml.replace('</body>', `${pixel}</body>`);
  }
  return wrappedHtml + pixel;
}
