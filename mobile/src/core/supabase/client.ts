// React Native Supabase client.
//
// Differences from the web client:
//  - Uses AsyncStorage to persist the auth session (no localStorage in RN).
//  - detectSessionInUrl is disabled (there is no browser URL to parse;
//    OAuth / email-confirm round-trips arrive via deep links instead).
//  - Config comes from EXPO_PUBLIC_* env vars, which Expo inlines at build
//    time. If they are absent the client is null and the app runs fully
//    offline (auth + cloud sync simply disabled), matching the web behavior.
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Auth and cloud sync are disabled; the app runs in local-only mode."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
