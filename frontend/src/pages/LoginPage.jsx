import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const LoginPage = ({ onBack, activePage, onNavigate, onBrandClick }) => {
  const [activeTab, setActiveTab] = useState("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const tabItems = [
    { id: "mobile", label: "Mobile & OTP" },
    { id: "email", label: "Email Login" },
  ];

  const validateMobile = (value) => /^\d{10}$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleOtpRequest = () => {
    const nextErrors = {};

    if (!validateMobile(mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setErrors({});
    }
  };

  const handleEmailContinue = () => {
    const nextErrors = {};

    if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setErrors({});
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink" style={{ colorScheme: "light" }}>
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center">
          <section className="w-full max-w-[740px] overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)] lg:max-w-[720px]">
            <div className="bg-navy px-6 py-6 text-center text-white sm:px-8 sm:py-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[2.05rem]">Citizen Login</h1>
              <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">
                Access real-time road infrastructure data
              </p>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid grid-cols-2 gap-3 border-b border-border pb-5 text-center sm:gap-4">
                {tabItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`rounded-xl border px-3 py-3.5 text-sm font-semibold transition sm:px-4 sm:py-4 sm:text-base ${
                      activeTab === item.id
                        ? "border-navy bg-[#eef3fb] text-navy shadow-[0_2px_8px_rgba(15,35,72,0.08)]"
                        : "border-border bg-white text-ink/62 hover:border-[#c7cfda] hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {activeTab === "mobile" ? (
                  <div className="mx-auto w-full max-w-[560px] space-y-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        10-Digit Mobile Number
                      </label>
                      <div className="flex w-full items-stretch overflow-hidden rounded-lg border border-[#8a919d] bg-white focus-within:border-navy">
                        <span className="flex items-center border-r border-[#d4d8df] bg-white px-4 py-3.5 text-base text-ink/70 sm:py-4">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter your mobile number"
                          value={mobileNumber}
                          onChange={(event) => {
                            const nextValue = event.target.value.replace(/\D/g, "").slice(0, 10);
                            setMobileNumber(nextValue);

                            if (errors.mobileNumber) {
                              setErrors((currentErrors) => ({ ...currentErrors, mobileNumber: undefined }));
                            }
                          }}
                          className="min-w-0 flex-1 bg-white px-4 py-3.75 text-base text-ink outline-none placeholder:text-ink/38 sm:py-4"
                        />
                      </div>
                      {errors.mobileNumber ? <p className="text-sm text-red-600">{errors.mobileNumber}</p> : null}
                    </div>

                    <button
                      type="button"
                      onClick={handleOtpRequest}
                      className="w-full rounded-lg bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#f39a32]"
                    >
                      Request OTP
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-[560px] space-y-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        Official Email
                      </label>
                      <input
                        type="email"
                        placeholder="official@department.gov.in"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);

                          if (errors.email) {
                            setErrors((currentErrors) => ({ ...currentErrors, email: undefined }));
                          }
                        }}
                        className="w-full rounded-lg border border-[#8a919d] bg-white px-4 py-4 text-base text-ink outline-none placeholder:text-ink/38 focus:border-navy"
                      />
                      {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold tracking-tight text-ink sm:text-[0.98rem]">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);

                          if (errors.password) {
                            setErrors((currentErrors) => ({ ...currentErrors, password: undefined }));
                          }
                        }}
                        className="w-full rounded-lg border border-[#8a919d] bg-white px-4 py-4 text-base text-ink outline-none placeholder:text-ink/38 focus:border-navy"
                      />
                      {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
                    </div>

                    <button
                      type="button"
                      onClick={handleEmailContinue}
                      className="w-full rounded-lg bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#f39a32]"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>

              <div className="my-7 flex items-center gap-4 text-sm text-ink/56">
                <span className="h-px flex-1 bg-border" />
                <span className="uppercase tracking-[0.18em]">Or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                onClick={onBack}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#141b29] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0f1a2e] transition hover:bg-muted"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-current text-[0.7rem] leading-none">
                  ID
                </span>
                Department Login
              </button>

              <div className="mt-6 text-center text-sm text-ink/70 sm:text-base">
                New to RoadWatch?{" "}
                <button type="button" className="font-semibold text-[#a16006] transition hover:text-[#7f4a03]">
                  Register Here
                </button>
              </div>
            </div>

            <div className="border-t border-border bg-[#eef3fb] px-6 py-4 text-center text-sm text-ink/70 sm:px-8">
              Secure portal access
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;