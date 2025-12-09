import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/stats/events - Record a user action event
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
    const { event } = body;

    if (!event || !['country_marked', 'map_exported', 'share_clicked'].includes(event)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's stats with maybeSingle to avoid errors when no record exists
    const { data: existingStats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    // Determine which field to increment
    let updateField: string;
    switch (event) {
      case 'country_marked':
        updateField = 'countries_marked';
        break;
      case 'map_exported':
        updateField = 'maps_exported';
        break;
      case 'share_clicked':
        updateField = 'shares_clicked';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    if (existingStats) {
      // Atomic update with optimistic locking
      const currentValue = (existingStats[updateField as keyof typeof existingStats] as number) || 0;
      await supabaseAdmin
        .from('daily_stats')
        .update({
          [updateField]: currentValue + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('date', today)
        .eq(updateField, currentValue); // Optimistic lock on the specific field
    } else {
      // Create new daily stats entry using upsert to handle race conditions
      const initialStats: Record<string, number> = {
        visits_count: 0,
        countries_marked: 0,
        maps_exported: 0,
        shares_clicked: 0,
      };
      initialStats[updateField] = 1;

      await supabaseAdmin
        .from('daily_stats')
        .upsert({
          date: today,
          ...initialStats,
        }, { onConflict: 'date', ignoreDuplicates: false });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/stats/events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

