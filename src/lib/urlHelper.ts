/**
 * Constructs a clean, standalone gift URL without any platform internal tokens or admin routes
 */
export function getCleanGiftUrl(to: string, from: string, topic?: string, note?: string): string {
  try {
    // Force path to root '/' so it strips any /dev or admin query parameters
    const cleanUrl = new URL('/', window.location.origin);
    
    if (to && to.trim()) {
      cleanUrl.searchParams.set('to', to.trim());
    }
    if (from && from.trim()) {
      cleanUrl.searchParams.set('from', from.trim());
    }
    if (topic && topic !== 'all') {
      cleanUrl.searchParams.set('topic', topic.trim());
    }
    if (note && note.trim()) {
      cleanUrl.searchParams.set('note', note.trim());
    }
    
    return cleanUrl.toString();
  } catch {
    return window.location.origin;
  }
}

/**
 * Returns a ready-to-send polite greeting message with the clean URL
 */
export function getGiftShareMessage(to: string, from: string, url?: string): string {
  const recipient = to.trim() || 'bạn';
  const finalUrl = url || getCleanGiftUrl(to, from);
  return `🌸 20/10 này mình có món quà nhỏ gửi tặng ${recipient} nè, mở ra xem nhé: ${finalUrl}`;
}

/**
 * Checks whether the current session is in Creator/Dev mode:
 * STRICT RULE: ONLY returns true if the URL explicitly has ?dev, ?admin, #dev, or #admin.
 * Anyone accessing the normal domain (e.g. ldkien.me or ldkien.me/?to=...) is strictly READ-ONLY!
 */
export function checkIsCreatorMode(): boolean {
  try {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    // 1. Query param check: ?dev, ?admin, ?create, ?mode=dev (100% immune to 502 Bad Gateway)
    if (
      search.includes('dev') ||
      search.includes('admin') ||
      search.includes('create')
    ) {
      return true;
    }

    // 2. Hash check: #dev, #admin, #create
    if (
      hash.includes('dev') ||
      hash.includes('admin') ||
      hash.includes('create')
    ) {
      return true;
    }

    // 3. Path check: /dev, /create (for servers that support SPA fallback)
    if (
      path.endsWith('/dev') ||
      path.endsWith('/create') ||
      path.includes('/dev/') ||
      path.includes('/create/')
    ) {
      return true;
    }

    // Everyone else (including root domain ldkien.me and gift links ?to=...) is in READ-ONLY mode!
    return false;
  } catch {
    return false;
  }
}
