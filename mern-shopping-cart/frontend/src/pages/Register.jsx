import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, saveUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  const passkeyRegister = async () => {
    try {
      if (!name || !email) {
        alert("Enter name and email first");
        return;
      }

      const { data: options } = await API.post(
        "/auth/passkey/register-options",
        { name, email }
      );

      const registrationResponse = await startRegistration({
        optionsJSON: options,
      });

      const { data } = await API.post("/auth/passkey/register-verify", {
        email,
        credential: registrationResponse,
      });

      saveUser(data);
      alert("Passkey registered successfully");
      navigate("/");
    } catch (err) {
      console.error("Passkey register error:", err);

      if (err.name === "NotAllowedError") {
        alert(
          "Passkey was cancelled or blocked by the browser. Try again using localhost, Safari/Chrome, and allow Touch ID/password prompt."
        );
        return;
      }

      alert(
        err.response?.data?.message ||
          err.message ||
          "Passkey register failed"
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual">
          <span className="eyebrow">Join FreshCart</span>
          <h1>Create your account and start building your basket.</h1>
          <p>
            Register with email or passkey and enjoy a smooth shopping
            experience.
          </p>
        </div>

        <form onSubmit={submit} className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Fill your details to get started.</p>

          <label>
            Full Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </label>

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

          <button type="submit">Create Account</button>

          <button type="button" className="outline" onClick={passkeyRegister}>
            Register with Passkey
          </button>

          <p>
            Have account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}