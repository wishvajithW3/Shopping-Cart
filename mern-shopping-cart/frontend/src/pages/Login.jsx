import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startAuthentication } from "@simplewebauthn/browser";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("123456");

  const { login, saveUser } = useAuth();
  const navigate = useNavigate();

  const apiRoot = (
    import.meta.env.VITE_API_URL || "http://localhost:5001/api"
  ).replace(/\/api\/?$/, "");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const passkeyLogin = async () => {
    try {
      if (!email) {
        alert("Enter email first");
        return;
      }

      const { data: options } = await API.post("/auth/passkey/login-options", {
        email,
      });

      const authenticationResponse = await startAuthentication({
        optionsJSON: options,
      });

      const { data } = await API.post("/auth/passkey/login-verify", {
        email,
        credential: authenticationResponse,
      });

      saveUser(data);
      alert("Passkey login successful");
      navigate("/");
    } catch (err) {
      console.error("Passkey login error:", err);
      alert(err.response?.data?.message || err.message || "Passkey login failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual">
          <span className="eyebrow">Welcome back</span>
          <h1>Login to continue shopping fresh products.</h1>
          <p>
            Access your cart, checkout summary, and admin tools from one secure
            account.
          </p>
        </div>

        <form onSubmit={submit} className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">Use your account to continue.</p>

          <label>
            Email Address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>

          <button type="submit">Login</button>

          <button type="button" className="outline" onClick={passkeyLogin}>
            Login with Passkey
          </button>

          <div className="social-actions">
            <a className="outline linkbtn" href={`${apiRoot}/api/auth/google`}>
              Continue with Google
            </a>

            <a className="outline linkbtn" href={`${apiRoot}/api/auth/facebook`}>
              Continue with Facebook
            </a>
          </div>

          <p>
            No account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
}