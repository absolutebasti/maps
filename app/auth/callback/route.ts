import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type");
    const origin = requestUrl.origin;

    // Create Supabase client for auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (code && supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            await supabase.auth.exchangeCodeForSession(code);
        } catch (error) {
            console.error("Error exchanging code for session:", error);
            // Redirect to home with error
            return NextResponse.redirect(`${origin}/?auth_error=true`);
        }
    }

    // If this is a signup confirmation, redirect to the success page
    if (type === "signup" || type === "email") {
        return NextResponse.redirect(`${origin}/auth/confirm`);
    }

    // For other auth flows (password reset, etc.), redirect to home
    return NextResponse.redirect(origin);
}
