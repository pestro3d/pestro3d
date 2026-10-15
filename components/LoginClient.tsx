"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSafeRedirectPath } from "@/lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type FormMode = "sign-in" | "sign-up" | "reset";
type BusyMode = FormMode | null;

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<FormMode>("sign-in");
  const [busy, setBusy] = useState<BusyMode>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    isSupabaseConfigured ? "" : "Supabase environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    getSupabaseClient().auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (data.session) {
        const params = new URLSearchParams(window.location.search);
        window.location.replace(getSafeRedirectPath(params.get("next")));
      }
    }).catch((sessionError: Error) => {
      if (active) setError(sessionError.message);
    });

    return () => {
      active = false;
    };
  }, []);

  const getRedirectUrl = (nextPath?: string) => {
    const params = new URLSearchParams(window.location.search);
    const next = getSafeRedirectPath(nextPath ?? params.get("next"));
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  };

  const changeMode = (newMode: FormMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(mode);
    setError("");
    setMessage("");

    try {
      const client = getSupabaseClient();
      const normalizedEmail = email.trim();

      if (mode === "sign-in") {
        const { data, error: authError } = await client.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (authError) throw authError;
        if (!data.session) throw new Error("Sign-in succeeded but no session was created. Please try again.");

        const params = new URLSearchParams(window.location.search);
        window.location.replace(getSafeRedirectPath(params.get("next")));
        return;
      }

      if (mode === "sign-up") {
        const { data, error: authError } = await client.auth.signUp({
          email: normalizedEmail,
          password,
          options: { emailRedirectTo: getRedirectUrl() },
        });
        if (authError) throw authError;

        if (data.session) {
          const params = new URLSearchParams(window.location.search);
          window.location.replace(getSafeRedirectPath(params.get("next")));
          return;
        }

        setMessage(`Your account is ready. Check ${normalizedEmail} to confirm your email before signing in.`);
        return;
      }

      const { error: authError } = await client.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getRedirectUrl("/auth/reset-password"),
      });
      if (authError) throw authError;
      setMessage(`If an account exists for ${normalizedEmail}, we’ve sent a password reset link.`);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "We couldn't complete that request. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const heading = mode === "sign-in"
    ? <>Welcome <em>back.</em></>
    : mode === "sign-up"
      ? <>Make it <em>yours.</em></>
      : <>A fresh <em>start.</em></>;

  const submitLabel = mode === "sign-in"
    ? "Sign in"
    : mode === "sign-up"
      ? "Create account"
      : "Send reset link";

  return (
    <section className="login-page">
      <div className="login-art" aria-hidden="true">
        <div className="login-art-orbit" />
        <p className="eyebrow light"><span /> Made for your story</p>
        <h1>A little piece<br />of <em>your story.</em></h1>
        <p className="login-art-note">Sign in to keep your keepsakes and order updates close.</p>
        <span className="login-art-mark">P3D&nbsp; / &nbsp;EST. WITH CARE</span>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <Link href="/" className="login-back">← Back to Pestro3D</Link>
          <p className="eyebrow"><span /> Your account</p>
          <h2>{heading}</h2>
          <p className="login-intro">
            {mode === "reset"
              ? "Enter your account email and we’ll send you a link to choose a new password."
              : "Sign in to follow your order and revisit the moments you’re turning into keepsakes."}
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {mode !== "reset" && (
              <>
                <label className="login-password-label" htmlFor="login-password">Password</label>
                <div className="login-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                    placeholder={mode === "sign-up" ? "At least 8 characters" : "Enter your password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    className="login-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </>
            )}

            <button className="login-submit" type="submit" disabled={busy !== null || !isSupabaseConfigured}>
              {busy === mode
                ? mode === "reset" ? "Sending reset link…" : mode === "sign-up" ? "Creating account…" : "Signing in…"
                : submitLabel}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          {mode === "sign-in" && (
            <button className="login-resend login-forgot" type="button" onClick={() => changeMode("reset")}>
              Forgot your password?
            </button>
          )}

          {message && <p className="login-success-message" role="status">{message}</p>}
          {error && <p className="login-error" role="alert">{error}</p>}

          <p className="login-mode-switch">
            {mode === "sign-in" ? (
              <>New to Pestro3D? <button type="button" onClick={() => changeMode("sign-up")}>Create an account</button></>
            ) : mode === "sign-up" ? (
              <>Already have an account? <button type="button" onClick={() => changeMode("sign-in")}>Sign in</button></>
            ) : (
              <>Remember your password? <button type="button" onClick={() => changeMode("sign-in")}>Back to sign in</button></>
            )}
          </p>

          <p className="login-legal">
            By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
