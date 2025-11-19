import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';

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
export async function GET() {
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
      console.error('Error fetching stats:', error);
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
    console.error('Error in GET /api/stats:', error);
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
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { session_id, page_path, user_agent } = body;

    // Get client IP and hash it
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
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
      console.error('Error inserting visit:', visitError);
      // Continue anyway - don't fail the request
    }

    // Update or create daily stats
    const today = new Date().toISOString().split('T')[0];
    
    // Check if today's stats exist
    const { data: existingStats } = await supabaseAdmin
      .from('daily_stats')
      .select('visits_count')
      .eq('date', today)
      .single();

    if (existingStats) {
      // Update existing stats
      // Only increment if this is a unique session (check if session visited today)
      const { data: todayVisits } = await supabaseAdmin
        .from('visits')
        .select('session_id')
        .eq('session_id', session_id)
        .gte('visited_at', `${today}T00:00:00.000Z`)
        .limit(1);

      // Only increment if this is the first visit from this session today
      if (!todayVisits || todayVisits.length === 0) {
        await supabaseAdmin
          .from('daily_stats')
          .update({
            visits_count: (existingStats.visits_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('date', today);
      }
    } else {
      // Create new daily stats entry
      await supabaseAdmin
        .from('daily_stats')
        .insert({
          date: today,
          visits_count: 1,
          countries_marked: 0,
          maps_exported: 0,
          shares_clicked: 0,
        });
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

