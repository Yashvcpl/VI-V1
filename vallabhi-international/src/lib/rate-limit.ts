import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Falls back to "no limiter configured" in local dev if Upstash env vars are
// missing, so `npm run dev` doesn't hard-crash - but this MUST be configured
// before production deploy, since the form route treats a missing limiter as
// "allow" (see route.ts).
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const leadFormRateLimit = redis
  ? new Ratelimit({
      redis,
      // 5 submissions per 10 minutes per IP - generous enough for a genuine
      // user retrying a validation error, tight enough to stop scripted spam.
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:lead-form",
    })
  : null;
