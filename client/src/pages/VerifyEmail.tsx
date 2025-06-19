import React, { useState, useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import ErrorMessage from "../components/ErrorMessage";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  const handleSendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
    } catch (err) {
      setError(err.message || "Unable to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
      setSuccess(true);
      setTimeout(() => navigate("/personalization"), 2000);
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Send code on mount if email is present (only once, even in StrictMode)
  const sentOnMount = useRef(false);
  useEffect(() => {
    if (email && !sentOnMount.current) {
      handleSendCode();
      sentOnMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Verify Your Email</h1>
        <p style={styles.subtitle}>
          Enter the code sent to <strong>{email}</strong>
        </p>
        <form style={styles.form} onSubmit={handleVerify}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Verification Code</label>
            <div style={styles.inputContainer}>
              <Mail style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                className={`input ${code && "input-focused"}`}
                required
              />
            </div>
            <button
              style={{
                padding: 0,
                paddingLeft: "4px",
                textAlign: "start",
              }}
              onClick={handleSendCode}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Resend Code"}
            </button>
          </div>
          {error && <ErrorMessage message={error} />}
          {success && (
            <div style={{ color: "green", marginBottom: 8 }}>
              Email verified! Redirecting...
            </div>
          )}
          <button style={styles.submitButton} disabled={loading} type="submit">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
