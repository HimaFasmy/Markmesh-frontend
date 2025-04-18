import React, { useState } from "react";
import './LoginSignup.css';

// Icons
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

// Firebase auth
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";

// Toast notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = ({ onLogin }) => {
  // Form state
  const [action, setAction] = useState("Sign Up");       // Toggle between Login and Sign Up
  const [email, setEmail] = useState("");                // Email input
  const [password, setPassword] = useState("");          // Password input
  const [name, setName] = useState("");                  // Name (Sign Up only)
  const [errors, setErrors] = useState({});              // Validation errors
  const [showPassword, setShowPassword] = useState(false); // Show/Hide password toggle

  // --- Input Validation ---
  const validateForm = () => {
    let formErrors = {};
    let showToast = false;

    if (!email) {
      formErrors.email = "Email is required";
      showToast = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
      showToast = true;
    }

    if (!password) {
      formErrors.password = "Password is required";
      showToast = true;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
      showToast = true;
    }

    if (action === "Sign Up" && !name) {
      formErrors.name = "Name is required";
      showToast = true;
    }

    if (showToast) {
      toast.error("Please fill in all required fields or correct the errors.");
    }

    return formErrors;
  };

  // --- Handle Sign Up ---
  const handleSignUp = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      toast.success("Sign up successful! Please verify your email before logging in.");
      setAction("Login"); // Switch to Login after successful sign up
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Handle Sign In ---
  const handleSignIn = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }
      toast.success("Login successful!");
      onLogin(); // Call callback on success
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Handle Forgot Password ---
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Toggle Between Login and Sign Up ---
  const toggleAction = () => {
    setAction(prev => (prev === "Sign Up" ? "Login" : "Sign Up"));
    setErrors({});
  };

  return (
    <>
      {/* Toast Notification Handler */}
      <ToastContainer />

      <div className="login-page">
        <div className="logo-bar">MarkMesh</div>

        <div className='container'>
          {/* --- Header Section --- */}
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>

          {/* --- Input Fields --- */}
          <div className="inputs">

            {/* Name Field (Only for Sign Up) */}
            {action === "Login" ? null : (
              <div className="input">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            )}

            {/* Email Field */}
            <div className="input">
              <img src={email_icon} alt="" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="input password-input">
              <img src={password_icon} alt="" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            {/* Forgot Password (Only on Login) */}
            {action === "Sign Up" ? null : (
              <div className="forgot-password">
                Forgot Password?{" "}
                <span onClick={handlePasswordReset}>
                  Click here to reset
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="submit-container">
              <div
                className="submit"
                onClick={action === "Sign Up" ? handleSignUp : handleSignIn}
              >
                {action}
              </div>
            </div>
          </div>

          {/* Switch Between Login/Sign Up */}
          <div className="toggle-action">
            {action === "Sign Up" ? (
              <p>Already have an account? <span onClick={toggleAction}>Sign In</span></p>
            ) : (
              <p>Don't have an account? <span onClick={toggleAction}>Sign Up</span></p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
