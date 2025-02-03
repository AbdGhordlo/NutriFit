import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { styles } from "./styles/AuthStyles";
import { commonStyles } from "./styles/commonStyles";

export default function Login() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  return (
    <div style={commonStyles.container}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue to NutriFit</p>

          <button style={styles.googleButton}>
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

          <form style={styles.form}>
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

            <div style={styles.forgotPassword}>
              <a href="#" style={styles.link}>
                Forgot password?
              </a>
            </div>

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
