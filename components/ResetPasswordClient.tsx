"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    isSupabaseConfigured ? "" : "Supabase authentication is not configured."
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getSupabaseClient().auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
      } else if (data.session) {
        setReady(true);
      } else {
        setError("This password reset link is invalid or has expired. Request a new one to continue.");
      }
    }).catch((sessionError: Error) => setError(sessionError.message));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await getSupabaseClient().auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage("Your password has been updated. You can now sign in with your new password.");
      setReady(false);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "We couldn't update your password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-callback-page">
      <div className="auth-callback-card">
        <p className="eyebrow"><span /> Account security</p>
        <h1>Choose a new <em>password.</em></h1>
        {ready ? (
          <form className="login-form reset-password-form" onSubmit={handleSubmit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button className="login-submit" type="submit" disabled={busy}>
              {busy ? "Updating password…" : "Update password"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        ) : (
          <p className="auth-callback-message" role={error ? "alert" : "status"}>
            {error || message}
          </p>
        )}
        {error && ready && <p className="login-error" role="alert">{error}</p>}
        {message && <p className="login-success-message" role="status">{message}</p>}
        {(error || message) && <Link className="login-reset-link" href="/login">Back to sign in</Link>}
      </div>
    </section>
  );
}
