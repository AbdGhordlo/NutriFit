import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import "../assets/commonStyles.css";
import "./styles/AuthStyles.css";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
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
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Function to handle Google login
  const handleGoogleSignup = () => {
    // Redirect to the backend's Google OAuth endpoint
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <div className="form-container">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">
            Join NutriFit to start your fitness journey
          </p>

          {/* Google Signup Button */}
          <button style={styles.googleButton} onClick={handleGoogleSignup}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-icon"
            />
            Sign up with Google
          </button>

          <div className="divider">
            <span className="divider-text">or register with email</span>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Full Name</label>
              <div className="input-container">
                <User className="input-icon" />
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
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Email</label>
              <div className="input-container">
                <Mail className="input-icon" />
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

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <button className="submit-button">Create Account</button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <a href="/login" className="link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}