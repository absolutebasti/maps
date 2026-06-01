import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Production URL - hardcoded to avoid origin detection issues
const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maps-production-aa69.up.railway.app";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type");
    const next = requestUrl.searchParams.get("next");

    // Create Supabase client for auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Handle PKCE flow (code exchange)
    if (code && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
                // Successfully exchanged code - show success page
                return NextResponse.redirect(`${PRODUCTION_URL}/auth/confirm`);
            }
        } catch (error) {
            console.error("Error exchanging code for session:", error);
        }
    }

    // Handle token hash flow (email confirmation)
    if (token_hash && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase.auth.verifyOtp({
                token_hash,
                type: type as "email" | "signup" | "recovery" | "email_change" || "email",
            });
            if (!error) {
                return NextResponse.redirect(`${PRODUCTION_URL}/auth/confirm`);
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    // Check type parameter for email confirmations
    if (type === "signup" || type === "email" || type === "email_change" || type === "magiclink") {
        return NextResponse.redirect(`${PRODUCTION_URL}/auth/confirm`);
    }

    // If there's a next parameter, redirect there
    if (next) {
        return NextResponse.redirect(`${PRODUCTION_URL}${next}`);
    }

    // For other auth flows, redirect to home
    return NextResponse.redirect(PRODUCTION_URL);
}
