import { createClient } from './client';
import type { CountryData, Settings } from '../state/store';

// Database types
export type DbCountry = {
  id: string;
  user_id: string;
  country_code: string;
  visited: boolean;
  notes: string | null;
  rating: number | null;
  visited_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbUserSettings = {
  user_id: string;
  visited_country_color: string;
  theme: string;
  created_at: string;
  updated_at: string;
};

// Convert database format to app format
function dbCountryToApp(db: DbCountry): CountryData {
  return {
    id: db.country_code,
    visited: db.visited,
    tags: [], // Tags will be added in a future update
    note: db.notes || undefined,
    visitedAt: db.visited_at || undefined,
    rating: db.rating || undefined,
  };
}

// Convert app format to database format
function appCountryToDb(countryCode: string, data: CountryData, userId: string): Partial<DbCountry> {
  return {
    user_id: userId,
    country_code: countryCode,
    visited: data.visited,
    notes: data.note || null,
    rating: data.rating || null,
    visited_at: data.visitedAt || null,
  };
}

/**
 * Fetch all countries for the current user
 */
export async function fetchUserCountries(): Promise<Record<string, CountryData>> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return {};
  }

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }

  const countriesById: Record<string, CountryData> = {};
  for (const dbCountry of data || []) {
    countriesById[dbCountry.country_code] = dbCountryToApp(dbCountry);
  }

  return countriesById;
}

/**
 * Sync local countries to Supabase
 */
export async function syncCountriesToSupabase(countries: Record<string, CountryData>): Promise<void> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return;
  }

  // Convert to database format
  const dbCountries = Object.entries(countries).map(([countryCode, data]) => 
    appCountryToDb(countryCode, data, user.id)
  );

  if (dbCountries.length === 0) return;

  // Upsert all countries
  const { error } = await supabase
    .from('countries')
    .upsert(dbCountries, { 
      onConflict: 'user_id,country_code',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error syncing countries:', error);
    throw error;
  }
}

/**
 * Update a single country
 */
export async function updateCountry(countryCode: string, data: CountryData): Promise<void> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return;
  }

  const dbData = appCountryToDb(countryCode, data, user.id);

  const { error } = await supabase
    .from('countries')
    .upsert(dbData, { 
      onConflict: 'user_id,country_code',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error updating country:', error);
    throw error;
  }
}

/**
 * Delete a country
 */
export async function deleteCountry(countryCode: string): Promise<void> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return;
  }

  const { error } = await supabase
    .from('countries')
    .delete()
    .eq('user_id', user.id)
    .eq('country_code', countryCode);

  if (error) {
    console.error('Error deleting country:', error);
    throw error;
  }
}

/**
 * Fetch user settings
 */
export async function fetchUserSettings(): Promise<Partial<Settings> | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return null;
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // If no settings exist yet, that's okay
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching settings:', error);
    throw error;
  }

  return {
    visitedCountryColor: data.visited_country_color,
    theme: data.theme as 'light' | 'dark' | 'system',
  };
}

/**
 * Update user settings
 */
export async function updateUserSettings(settings: Partial<Settings>): Promise<void> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No user logged in');
    return;
  }

  const dbSettings: Partial<DbUserSettings> = {
    user_id: user.id,
  };

  if (settings.visitedCountryColor) {
    dbSettings.visited_country_color = settings.visitedCountryColor;
  }
  if (settings.theme) {
    dbSettings.theme = settings.theme;
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(dbSettings, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    });

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

