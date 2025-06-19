import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import "../assets/commonStyles.css";
import ErrorMessage from "../components/ErrorMessage";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault(); // Prevent page reload
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/verify-email", { state: { email: formData.email } });
        localStorage.setItem("token", data.token); // Store JWT in localStorage
        window.location.href = "/personalization"; // Redirect to personalization steps
      } else {
        setErrorMessage(data.message ?? "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSuccess = async (response) => {
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
        window.location.href = "/personalization";
      } else {
        setErrorMessage(data.message ?? "Google signup failed");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setErrorMessage("Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupError = () => {
    setErrorMessage("Google signup failed");
  };

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>
            Join NutriFit to start your fitness journey
          </p>

          {/* Google Signup Button */}
          <div className="w-full flex justify-center items-center">
            <GoogleLogin
              onSuccess={handleSignupSuccess}
              onError={() => {
                console.log("Google signup failed");
                handleSignupError();
              }}
              type="standard"
              size="large"
              text="signup_with"
              shape="rectangular"
              width={250}
            />
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or register with email</span>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputContainer}>
                <User style={styles.inputIcon} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your full name"
                  className={`input ${nameFocus ? "input-focused" : ""}`}
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
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

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <button style={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <a href="/login" style={styles.link}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
