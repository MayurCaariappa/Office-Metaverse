import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck, Sparkle, UsersThree } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../lib/api";
import type { AuthUser } from "../types";

const featureCards = [
  {
    title: "Realtime collaboration shell",
    description:
      "Live player presence, room-aware sync, and a cleaner foundation for future voice, chat, and interaction zones.",
    icon: UsersThree,
  },
  {
    title: "Startup-grade product polish",
    description:
      "An intentional visual system, a coherent product story, and a cleaner end-to-end experience.",
    icon: Sparkle,
  },
  {
    title: "Safer backend contracts",
    description:
      "Typed APIs, env validation, secure auth, structured responses, and saner extension points for future features.",
    icon: ShieldCheck,
  },
];

export function AuthPage({
  onAuthenticated,
}: {
  onAuthenticated: (token: string, user: AuthUser) => void;
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response =
        mode === "signin"
          ? await signIn({ username, password })
          : await signUp({ username, password });

      onAuthenticated(response.token, response.user);
      navigate("/maps");
    } catch (error) {
      const fallback = "We couldn't complete that request. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "error" in error.response.data &&
        typeof error.response.data.error === "object" &&
        error.response.data.error !== null &&
        "message" in error.response.data.error
      ) {
        setErrorMessage(String(error.response.data.error.message));
      } else {
        setErrorMessage(fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="marketing-shell">
      <section className="marketing-panel">
        <div className="eyebrow">Realtime virtual workspace</div>
        <h1>Office Metaverse</h1>
        <p className="lead">
          A realtime virtual office experience built to showcase full-stack
          product sense: secure auth, typed APIs, live player sync, and a visual
          experience that feels deliberate instead of prototype-heavy.
        </p>

        <div className="feature-grid">
          {featureCards.map(({ description, icon: Icon, title }) => (
            <article key={title} className="feature-card">
              <Icon size={24} weight="duotone" />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="glass-card auth-card">
          <div className="auth-header">
            <span className="pill">
              {mode === "signin" ? "Welcome back" : "Create your player"}
            </span>
            <h2>
              {mode === "signin" ? "Enter the office" : "Start your session"}
            </h2>
            <p>
              Use the current multiplayer slice of the app to explore the office
              and see other connected users move in realtime.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="mayur-builds"
                minLength={3}
                maxLength={30}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                maxLength={72}
                required
              />
            </label>

            {errorMessage ? (
              <div className="form-error">{errorMessage}</div>
            ) : null}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "signin"
                  ? "Signing you in..."
                  : "Creating account..."
                : mode === "signin"
                  ? "Launch lobby"
                  : "Create account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            <span>
              {mode === "signin"
                ? "Need an account for the demo?"
                : "Already have an account?"}
            </span>
            <button
              className="ghost-button"
              type="button"
              onClick={() =>
                setMode((current) =>
                  current === "signin" ? "signup" : "signin",
                )
              }
            >
              {mode === "signin" ? "Create one" : "Switch to sign in"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
