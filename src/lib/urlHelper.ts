/**
 * Constructs a clean, standalone gift URL without any platform internal tokens or admin routes
 */
export function getCleanGiftUrl(to: string, from: string, topic?: string, note?: string): string {
  try {
    // Force path to root '/' so it strips any /dev or /create admin routes
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
 * - URL path has /dev, /create, or /edit (e.g. https://domain.com/dev)
 * - URL query has ?dev, ?create, or ?mode=dev (e.g. https://domain.com/?dev)
 * - Or visiting root domain without any ?to= parameter
 */
export function checkIsCreatorMode(): boolean {
  try {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();

    // 1. Explicit /dev or /create routes in pathname
    if (
      path.includes('/dev') ||
      path.includes('/create') ||
      path.includes('/edit')
    ) {
      return true;
    }

    // 2. Explicit ?dev or ?create query parameters
    if (
      search.includes('mode=dev') ||
      search.includes('mode=create') ||
      search.includes('dev') ||
      search.includes('create')
    ) {
      return true;
    }

    // 3. If there is a 'to' parameter, someone sent this card to a recipient -> MUST BE RECIPIENT MODE
    const params = new URLSearchParams(window.location.search);
    if (params.get('to')) {
      return false;
    }

    // 4. Default for root domain without 'to' is creator mode so the sender can craft the card
    return true;
  } catch {
    return false;
  }
}
