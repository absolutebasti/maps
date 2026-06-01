import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';
import {
  isRateLimited,
  getClientIP,
  isValidSessionId,
  isValidPagePath,
  isValidUserAgent,
  logError
} from '@/lib/api/security';

/**
 * Hash IP address for privacy
 */
function hashIP(ip: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * GET /api/stats - Get today's statistics
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      logError('Error fetching stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Return stats or defaults
    return NextResponse.json({
      visits_count: data?.visits_count || 0,
      countries_marked: data?.countries_marked || 0,
      maps_exported: data?.maps_exported || 0,
      shares_clicked: data?.shares_clicked || 0,
    });
  } catch (error) {
    logError('Error in GET /api/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stats - Record a new visit
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { session_id, page_path, user_agent } = body;

    // Input validation
    if (!isValidSessionId(session_id)) {
      return NextResponse.json(
        { error: 'Invalid session_id' },
        { status: 400 }
      );
    }

    if (!isValidPagePath(page_path)) {
      return NextResponse.json(
        { error: 'Invalid page_path' },
        { status: 400 }
      );
    }

    if (!isValidUserAgent(user_agent)) {
      return NextResponse.json(
        { error: 'Invalid user_agent' },
        { status: 400 }
      );
    }

    // Get client IP and hash it
    const ip_hash = hashIP(ip);

    // Insert visit record
    const { error: visitError } = await supabaseAdmin
      .from('visits')
      .insert({
        session_id,
        ip_hash,
        page_path: page_path || '/',
        user_agent: user_agent || null,
        visited_at: new Date().toISOString(),
      });

    if (visitError) {
      logError('Error inserting visit:', visitError);
      // Continue anyway - don't fail the request
    }

    // Update or create daily stats using atomic upsert
    const today = new Date().toISOString().split('T')[0];

    // Check if this session already visited today (to avoid duplicate counting)
    const { data: existingVisit } = await supabaseAdmin
      .from('visits')
      .select('id')
      .eq('session_id', session_id)
      .gte('visited_at', `${today}T00:00:00.000Z`)
      .lt('visited_at', `${today}T23:59:59.999Z`)
      .limit(1)
      .maybeSingle();

    // Only increment stats if this is a new session for today
    if (!existingVisit) {
      // Use upsert with RPC for atomic increment, or fallback to upsert
      // First try to get existing stats
      const { data: existingStats } = await supabaseAdmin
        .from('daily_stats')
        .select('visits_count')
        .eq('date', today)
        .maybeSingle();

      if (existingStats) {
        // Atomic update using the current value from the same transaction
        await supabaseAdmin
          .from('daily_stats')
          .update({
            visits_count: existingStats.visits_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('date', today)
          .eq('visits_count', existingStats.visits_count); // Optimistic lock
      } else {
        // Insert new record, ignore conflict (another request might have inserted)
        await supabaseAdmin
          .from('daily_stats')
          .upsert({
            date: today,
            visits_count: 1,
            countries_marked: 0,
            maps_exported: 0,
            shares_clicked: 0,
          }, { onConflict: 'date', ignoreDuplicates: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

