import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import "../assets/commonStyles.css";
import "./styles/AuthStyles.css";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT in localStorage
        window.location.href = "/home"; // Redirect to home page
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    // Redirect to the backend's Google OAuth endpoint
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue to NutriFit</p>

          {/* Google Login Button */}
          <button style={styles.googleButton} onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={styles.googleIcon}
            />
            Sign in with Google
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or continue with email</span>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  autoComplete="email" // Suggests the email field for autofill
                  placeholder="Enter your email"
                  className={`input ${emailFocus ? "input-focused" : ""}`}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password" // Suggests password autofill
                  placeholder="Enter your password"
                  className={`input ${passwordFocus ? "input-focused" : ""}`}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={styles.forgotPassword}>
              <a href="#" style={styles.link}>
                Forgot password?
              </a>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <button style={styles.submitButton}>
              <LogIn style={styles.buttonIcon} />
              Sign In
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <a href="/register" style={styles.link}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}