import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Serverless Honeypot & IP Rate Limiting Middleware
 * Shields public B2B lead generation forms from automated spam vectors.
 *
 * @module B2BConsultancy/Security
 * @author Gurpreet Bhamra | TFS Digital
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

export async function validateLeadSubmission(req: NextRequest) {
  // 1. Check client IP rate limits
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const now = Date.now();
  const clientRecord = ipRequestMap.get(ip);

  if (clientRecord && now < clientRecord.resetAt) {
    if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    clientRecord.count += 1;
  } else {
    ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  // 2. Parse request body for silent honeypot traps
  try {
    const body = await req.clone().json();

    // Hidden field traps populated exclusively by automated bots
    if (body._hp_website || body.company_fax_number) {
      // Silently accept to trap bots without exposing detection rules
      return NextResponse.json({ success: true, ref: 'OK-TRAPPED' }, { status: 200 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  return NextResponse.next();
}
