import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const RegisterPage = ({ activePage, onNavigate, onBrandClick }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    const nextErrors = {};

    if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setGeneralError(null);

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (error) {
      setGeneralError(error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGeneralError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setGeneralError(error?.message || "Google sign-up failed.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRegister();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink" style={{ colorScheme: "light" }}>
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center">
          <section className="w-full max-w-[740px] overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)] lg:max-w-[720px]">
            <div className="bg-navy px-6 py-6 text-center text-white sm:px-8 sm:py-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[2.05rem]">Create Account</h1>
              <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
                Join RoadWatch to report and track road infrastructure issues
              </p>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {generalError && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {generalError}
                </div>
              )}

              {success ? (
                <div className="mx-auto w-full max-w-[560px] space-y-5 text-center">
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-green-800">
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-100">
                      <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">Registration Successful!</p>
                    <p className="mt-2 text-sm text-green-700">
                      Check your email to verify your account before signing in.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("/login")}
                    className="w-full rounded-lg bg-navy px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-navy-deep"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-full max-w-[560px] space-y-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        Email Address
                      </label>
                      <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onKeyDown={handleKeyDown}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        className="w-full rounded-lg border border-[#8a919d] bg-white px-4 py-4 text-base text-ink outline-none placeholder:text-ink/38 focus:border-navy"
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        Password
                      </label>
                      <input
                        id="register-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onKeyDown={handleKeyDown}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        className="w-full rounded-lg border border-[#8a919d] bg-white px-4 py-4 text-base text-ink outline-none placeholder:text-ink/38 focus:border-navy"
                      />
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        Confirm Password
                      </label>
                      <input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onKeyDown={handleKeyDown}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (errors.confirmPassword) {
                            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }
                        }}
                        className="w-full rounded-lg border border-[#8a919d] bg-white px-4 py-4 text-base text-ink outline-none placeholder:text-ink/38 focus:border-navy"
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      id="register-submit"
                      type="button"
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full rounded-lg bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#f39a32] disabled:opacity-60"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </div>

                  <div className="my-7 flex items-center gap-4 text-sm text-ink/56">
                    <span className="h-px flex-1 bg-border" />
                    <span className="uppercase tracking-[0.18em]">Or</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <button
                    id="register-google"
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#141b29] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0f1a2e] transition hover:bg-muted"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="mt-6 text-center text-sm text-ink/70 sm:text-base">
                    Already have an account?{" "}
                    <button
                      id="register-login-link"
                      type="button"
                      onClick={() => onNavigate?.("/login")}
                      className="font-semibold text-[#a16006] transition hover:text-[#7f4a03]"
                    >
                      Sign In
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border bg-[#eef3fb] px-6 py-4 text-center text-sm text-ink/70 sm:px-8">
              Secure registration powered by Supabase
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
