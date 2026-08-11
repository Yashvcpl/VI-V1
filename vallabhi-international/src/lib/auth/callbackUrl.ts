export function normalizeCallbackUrl(callbackUrl: string | null | undefined, origin: string) {
  if (!callbackUrl) return "/admin";

  if (callbackUrl.startsWith("http://") || callbackUrl.startsWith("https://")) {
    try {
      const url = new URL(callbackUrl);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return `${origin}${url.pathname}${url.search}${url.hash}`;
      }
      return callbackUrl;
    } catch {
      return callbackUrl;
    }
  }

  return callbackUrl;
}
