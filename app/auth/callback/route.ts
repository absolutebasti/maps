import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type");
    const origin = requestUrl.origin;

    // Create Supabase client for auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let isEmailConfirmation = false;

    // Handle PKCE flow (code exchange)
    if (code && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
                isEmailConfirmation = true;
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
                type: "email",
            });
            if (!error) {
                isEmailConfirmation = true;
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    // Check if this is a signup/email confirmation by type or by successful verification
    if (isEmailConfirmation || type === "signup" || type === "email" || type === "email_change") {
        return NextResponse.redirect(`${origin}/auth/confirm`);
    }

    // For other auth flows, redirect to home
    return NextResponse.redirect(origin);
}
