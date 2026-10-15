"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSafeRedirectPath } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";

export default function AuthCallbackClient() {
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const finishSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const providerError = params.get("error_description") || params.get("error");
      const code = params.get("code");

      if (providerError) {
        setError(providerError);
        return;
      }

      if (!code) {
        setError("This sign-in link is invalid or has expired. Please request a new one.");
        return;
      }

      try {
        const { error: exchangeError } = await getSupabaseClient().auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;

        window.location.replace(getSafeRedirectPath(params.get("next")));
      } catch (authError) {
        setError(authError instanceof Error ? authError.message : "We couldn't complete sign-in. Please try again.");
      }
    };

    void finishSignIn();
  }, []);

  return (
    <section className="auth-callback-page" aria-live="polite">
      {error ? (
        <div className="auth-callback-card">
          <p className="eyebrow"><span /> Sign-in issue</p>
          <h1>Let’s try <em>again.</em></h1>
          <p className="auth-callback-message" role="alert">{error}</p>
          <Link className="login-submit auth-callback-link" href="/login">Back to sign in <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <div className="auth-callback-card">
          <span className="auth-callback-spinner" aria-hidden="true" />
          <p className="eyebrow"><span /> Secure sign-in</p>
          <h1>One moment, <em>please.</em></h1>
          <p className="auth-callback-message">We’re completing your sign-in and getting your account ready.</p>
        </div>
      )}
    </section>
  );
}
