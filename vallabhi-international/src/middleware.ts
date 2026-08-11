// Middleware is disabled to avoid Node 26 runtime sandbox issues with next-auth's edge middleware.
// Admin pages are protected by the authenticated admin layout, and sensitive API routes
// should be guarded server-side if required.

export const config = {
  matcher: [],
};
