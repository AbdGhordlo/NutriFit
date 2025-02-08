import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import { commonStyles } from "./styles/commonStyles";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMessage('');
    e.preventDefault();  // Prevent page reload
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <div style={commonStyles.container}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>
            Join NutriFit to start your fitness journey
          </p>

          <button style={styles.googleButton}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={styles.googleIcon}
            />
            Sign up with Google
          </button>

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
                  onChange={(e) => setFormData({ ...formData, username: e.target.value})}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value})}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                />
              </div>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage}/>}

            <button style={styles.submitButton}>Create Account</button>
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
