import { supabase } from './client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export type AuthResult = {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
};

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
        return { user: null, session: null, error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    return {
        user: data.user,
        session: data.session,
        error,
    };
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
        return { user: null, session: null, error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return {
        user: data.user,
        session: data.session,
        error,
    };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
        return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get the current user session
 */
export async function getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    if (!supabase) {
        return { session: null, error: null };
    }

    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
    if (!supabase) return { unsubscribe: () => { } };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });

    return { unsubscribe: () => subscription.unsubscribe() };
}
