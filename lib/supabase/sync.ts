import { supabase } from './client';
import type { CountryData, TagData, Settings } from '../state/store';

export type UserMapData = {
    countriesById: Record<string, CountryData>;
    tagsById: Record<string, TagData>;
    settings: Settings;
};

/**
 * Save user's map data to Supabase
 */
export async function saveToCloud(userId: string, data: UserMapData): Promise<{ error: Error | null }> {
    if (!supabase) {
        return { error: new Error('Supabase not configured') };
    }

    const { error } = await supabase
        .from('user_map_data')
        .upsert({
            user_id: userId,
            countries_data: data.countriesById,
            tags_data: data.tagsById,
            settings: data.settings,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        });

    if (error) {
        console.error('Error saving to cloud:', error);
        return { error: new Error(error.message) };
    }

    return { error: null };
}

/**
 * Load user's map data from Supabase
 */
export async function loadFromCloud(userId: string): Promise<{ data: UserMapData | null; error: Error | null }> {
    if (!supabase) {
        return { data: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase
        .from('user_map_data')
        .select('countries_data, tags_data, settings')
        .eq('user_id', userId)
        .single();

    if (error) {
        // PGRST116 = no rows found, which is fine for new users
        if (error.code === 'PGRST116') {
            return { data: null, error: null };
        }
        console.error('Error loading from cloud:', error);
        return { data: null, error: new Error(error.message) };
    }

    return {
        data: {
            countriesById: (data.countries_data as Record<string, CountryData>) || {},
            tagsById: (data.tags_data as Record<string, TagData>) || {},
            settings: (data.settings as Settings) || {
                theme: 'light',
                showLegend: true,
                showLabels: false,
                visitedCountryColor: '#E8DCC4',
            },
        },
        error: null,
    };
}

/**
 * Merge cloud data with local data
 * Strategy: Keep all countries from both, prefer cloud data for conflicts
 */
export function mergeData(cloudData: UserMapData | null, localData: UserMapData): UserMapData {
    if (!cloudData) {
        return localData;
    }

    // Merge countries - cloud takes precedence for same country
    const mergedCountries = { ...localData.countriesById };
    for (const [id, country] of Object.entries(cloudData.countriesById)) {
        if (mergedCountries[id]) {
            // If both have the country, use the one with more data
            const local = mergedCountries[id];
            const cloud = country;
            // Prefer cloud if it has more fields filled
            const cloudScore = (cloud.visited ? 1 : 0) + (cloud.note ? 1 : 0) + (cloud.rating ? 1 : 0) + (cloud.visitedAt ? 1 : 0);
            const localScore = (local.visited ? 1 : 0) + (local.note ? 1 : 0) + (local.rating ? 1 : 0) + (local.visitedAt ? 1 : 0);
            if (cloudScore >= localScore) {
                mergedCountries[id] = cloud;
            }
        } else {
            mergedCountries[id] = country;
        }
    }

    // Merge tags - combine both
    const mergedTags = { ...localData.tagsById, ...cloudData.tagsById };

    // Settings - prefer cloud
    const mergedSettings = { ...localData.settings, ...cloudData.settings };

    return {
        countriesById: mergedCountries,
        tagsById: mergedTags,
        settings: mergedSettings,
    };
}

/**
 * Delete user's map data from Supabase
 */
export async function deleteFromCloud(userId: string): Promise<{ error: Error | null }> {
    if (!supabase) {
        return { error: new Error('Supabase not configured') };
    }

    const { error } = await supabase
        .from('user_map_data')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting from cloud:', error);
        return { error: new Error(error.message) };
    }

    return { error: null };
}
