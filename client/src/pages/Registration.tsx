import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import { commonStyles } from "./styles/commonStyles";

export default function Registration() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

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

          <form style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputContainer}>
                <User style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  style={{
                    ...styles.input,
                    ...(nameFocus ? styles.inputFocused : {}),
                  }}
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    ...styles.input,
                    ...(emailFocus ? styles.inputFocused : {}),
                  }}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  style={{
                    ...styles.input,
                    ...(passwordFocus ? styles.inputFocused : {}),
                  }}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
              </div>
            </div>

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
