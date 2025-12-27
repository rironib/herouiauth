// lib/rateLimit.js

/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a similar solution
 */
const rateLimit = new Map();

export function checkRateLimit(identifier, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;

  if (!rateLimit.has(key)) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  const record = rateLimit.get(key);

  // Reset if window has passed
  if (now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  // Increment count
  record.count++;

  if (record.count > limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      retryAfter,
      error: `Too many requests. Please try again in ${retryAfter} seconds.`,
    };
  }

  return { success: true, remaining: limit - record.count };
}

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 3600000);
