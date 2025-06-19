import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import "../assets/commonStyles.css";
import "./styles/AuthStyles.css";
import ErrorMessage from "../components/ErrorMessage";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault(); // Prevent page reload
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user && data.user.email_verified === false) {
          navigate("/verify-email", { state: { email: data.user.email } });
          return;
        }
        localStorage.setItem("token", data.token); // Store JWT in localStorage
        window.location.href = "/home"; // Redirect to home page
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error("[Login] Exception:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (response) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const googleResponse = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await googleResponse.json();

      if (googleResponse.ok) {
        localStorage.setItem("token", data.token);

        // ✅ BURASI: token'dan email al ve sakla
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          localStorage.setItem(
            "userEmail",
            payload.email || "user@example.com"
          );
        } catch (error) {
          console.error("Token parse hatası:", error);
          localStorage.setItem("userEmail", "user@example.com");
        }

        window.location.href = "/home";
      } else {
        setErrorMessage(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage("Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    setErrorMessage("Google login failed");
  };

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue to NutriFit</p>

          {/* Google Login Button */}
          <div className="w-full flex justify-center items-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log("Google login failed");
                handleLoginError();
              }}
              type="standard"
              size="large"
              text="continue_with"
              shape="rectangular"
              width={250}
            />
          </div>

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
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`input ${emailFocus ? "input-focused" : ""}`}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`input ${passwordFocus ? "input-focused" : ""}`}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div style={styles.forgotPassword}>
              <a href="/forgot-password" style={styles.link}>
                Forgot password?
              </a>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <button style={styles.submitButton} disabled={isLoading}>
              <LogIn style={styles.buttonIcon} />
              {isLoading ? "Signing In..." : "Sign In"}
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
