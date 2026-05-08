import { NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';

// Simple in-memory rate limiter: max 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
): Promise<NextResponse> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
    return NextResponse.json(
      { error: 'Invalid redirect target' },
      { status: 400 },
    );
  }

  return NextResponse.redirect(link.url, { status: 301 });
}
