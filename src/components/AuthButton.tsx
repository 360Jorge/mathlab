"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error.message);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
    }
  }

  if (loading) {
    return (
      <button className="rounded border px-3 py-1.5 text-sm opacity-60">
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <button
        onClick={signOut}
        className="rounded border px-3 py-1.5 text-sm"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="rounded border px-3 py-1.5 text-sm"
    >
      Sign in
    </button>
  );
}