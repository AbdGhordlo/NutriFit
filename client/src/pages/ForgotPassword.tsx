// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import ErrorMessage from "../components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
      setSent(true);
    } catch (err) {
      setError(err.message || "Unable to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Check Your Email</h2>
          <p className="mb-3">
            You have been sent a reset code to{" "}
            <strong>{email}</strong>.
          </p>
          <button
            style={styles.submitButton}
            onClick={() =>
              navigate("/reset-password", { state: { email } })
            }
          >
            Enter Reset Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Forgot Password?</h1>
        <p style={styles.subtitle}>
          Enter your email to receive a reset code
        </p>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <Mail style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={`input ${email && "input-focused"}`}
                required
              />
            </div>
          </div>
          {error && <ErrorMessage message={error} />}
          <button style={styles.submitButton} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        <p style={styles.footer}>
          Remembered? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
