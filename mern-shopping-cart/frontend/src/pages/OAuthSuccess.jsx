import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { saveUser } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    const userData = {
      _id: id,
      name,
      email,
      role,
      token,
    };

    localStorage.setItem("userInfo", JSON.stringify(userData));

    if (saveUser) {
      saveUser(userData);
    }

    window.location.replace("/");
  }, [searchParams, saveUser]);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2>Login successful</h2>
        <p>Redirecting to home page...</p>
      </section>
    </main>
  );
}