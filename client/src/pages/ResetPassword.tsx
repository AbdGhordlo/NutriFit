import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import ErrorMessage from "../components/ErrorMessage";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email] = useState(state?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // focus trackers for styling
  const [codeFocus, setCodeFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [confFocus, setConfFocus] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>
          Enter the code you received, plus your new password.
        </p>

        <form style={styles.form} onSubmit={handleReset}>
          {/* Email (disabled) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <Mail style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                disabled
                style={{
                  ...styles.input,
                  ...styles.inputDisabled,
                }}
              />
            </div>
          </div>

          {/* Reset Code */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Reset Code</label>
            <div style={styles.inputContainer}>
              <Lock style={styles.inputIcon} />
              <input
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onFocus={() => setCodeFocus(true)}
                onBlur={() => setCodeFocus(false)}
                required
                style={{
                  ...styles.input,
                  ...(codeFocus ? styles.inputFocused : {}),
                }}
              />
            </div>
          </div>

          {/* New Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputContainer}>
              <Lock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                required
                style={{
                  ...styles.input,
                  ...(passFocus ? styles.inputFocused : {}),
                }}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputContainer}>
              <Lock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onFocus={() => setConfFocus(true)}
                onBlur={() => setConfFocus(false)}
                required
                style={{
                  ...styles.input,
                  ...(confFocus ? styles.inputFocused : {}),
                }}
              />
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <button style={styles.submitButton} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={styles.footer}>
          <Link to="/login" style={styles.link}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
