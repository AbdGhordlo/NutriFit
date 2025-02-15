import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import "../assets/commonStyles.css";
import "./styles/AuthStyles.css";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="outer-container">
      <div className="inner-container">
        <div className="form-container">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to continue to NutriFit</p>

          <button className="google-button">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-icon"
            />
            Sign in with Google
          </button>

          <div className="divider">
            <span className="divider-text">or continue with email</span>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Email</label>
              <div className="input-container">
                <Mail className="input-icon" />
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
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
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
                />
              </div>
            </div>

            <div className="forgot-password">
              <a href="#" className="link">
                Forgot password?
              </a>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <button className="submit-button">
              <LogIn className="button-icon" />
              Sign In
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <a href="/register" className="link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
