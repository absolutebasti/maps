import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// In production, use Redis (e.g., Upstash) for distributed rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Check if request is rate limited
 * Returns true if request should be blocked
 */
export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return false;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    record.count++;
    return false;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: unknown): sessionId is string {
    return (
        typeof sessionId === 'string' &&
        sessionId.length > 0 &&
        sessionId.length <= 100 &&
        /^[a-zA-Z0-9_-]+$/.test(sessionId)
    );
}

/**
 * Validate page path
 */
export function isValidPagePath(path: unknown): path is string {
    if (!path) return true; // Optional
    return (
        typeof path === 'string' &&
        path.length <= 500 &&
        path.startsWith('/')
    );
}

/**
 * Validate user agent
 */
export function isValidUserAgent(ua: unknown): ua is string {
    if (!ua) return true; // Optional
    return typeof ua === 'string' && ua.length <= 500;
}

/**
 * Validate event type
 */
export function isValidEventType(event: unknown): event is string {
    return (
        typeof event === 'string' &&
        ['country_marked', 'map_exported', 'share_clicked'].includes(event)
    );
}

/**
 * Safe error logging (only in development)
 */
export function logError(message: string, error: unknown): void {
    if (process.env.NODE_ENV === 'development') {
        console.error(message, error);
    }
}
