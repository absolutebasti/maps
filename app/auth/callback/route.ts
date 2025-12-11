import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type");
    const next = requestUrl.searchParams.get("next");
    const origin = requestUrl.origin;

    // Create Supabase client for auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Handle PKCE flow (code exchange)
    if (code && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
                // Successfully exchanged code - this is email confirmation
                // Always show the success page for new signups
                return NextResponse.redirect(`${origin}/auth/confirm`);
            }
        } catch (error) {
            console.error("Error exchanging code for session:", error);
        }
    }

    // Handle token hash flow (older email confirmation)
    if (token_hash && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase.auth.verifyOtp({
                token_hash,
                type: type as "email" | "signup" | "recovery" | "email_change" || "email",
            });
            if (!error) {
                return NextResponse.redirect(`${origin}/auth/confirm`);
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    // Check type parameter for email confirmations
    if (type === "signup" || type === "email" || type === "email_change" || type === "magiclink") {
        return NextResponse.redirect(`${origin}/auth/confirm`);
    }

    // If there's a next parameter, redirect there
    if (next) {
        return NextResponse.redirect(`${origin}${next}`);
    }

    // For other auth flows, redirect to home
    return NextResponse.redirect(origin);
}
