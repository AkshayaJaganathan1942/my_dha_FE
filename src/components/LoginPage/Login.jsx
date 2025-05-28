import React, { useRef, useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { USER_ENDPOINT } from "../../Api";
import ForgotPassword from "./ForgotPassword.jsx";

const Login = ({ setLoading }) => {
  const { setAuth } = useAuth();
  const wrapperRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "login";
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      alert("⚠️ Please enter your email before requesting an OTP!");
      return;
    }
    // Validate that email contains @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert(
        "❌ Invalid email format! Please enter a valid Gmail address (e.g., example@gmail.com)."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);

      if (data.message === "OTP sent successfully") {
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("⚠️ Something went wrong! Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  const verifyOtp = async () => {
    if (!enteredOtp) {
      alert("⚠️ Please enter OTP before verifying.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: enteredOtp }),
      });
      const data = await response.json();

      if (data.message === "OTP verified successfully") {
        alert("✅ OTP Verified Successfully! You can proceed with Signup.");
        setIsOtpVerified(true); // Set OTP verified state
        setOtpSent(false);
        setEnteredOtp("");
      } else {
        alert("❌ Invalid OTP! Please try again.");
        setIsOtpVerified(false); // Reset verification status
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // alert(
      //   "⚠️ Something went wrong while verifying OTP! Please try again later."
      // );
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  useEffect(() => {
    if (type === "login") {
      wrapperRef.current.classList.add("animated-signup");
      wrapperRef.current.classList.remove("animated-signin");
    } else {
      wrapperRef.current.classList.add("animated-signin");
      wrapperRef.current.classList.remove("animated-signup");
    }
  }, [type]);

  const handleSignUpClick = () => {
    wrapperRef.current.classList.add("animated-signin"); // Switch to sign-up animation
    wrapperRef.current.classList.remove("animated-signup");
  };

  const handleSignInClick = () => {
    wrapperRef.current.classList.add("animated-signup"); // Switch to login animation
    wrapperRef.current.classList.remove("animated-signin");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert("⚠️ You must verify your email before signing up!");
      return;
    }

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match! Please try again.");
      return;
    }

    try {
      // Fetch existing users from the server
      const response = await fetch(USER_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const users = await response.json(); // Parse the response as JSON

        // Check if username or email already exists
        const usernameExists = users.some((user) => user.username === username);
        const emailExists = users.some((user) => user.email === email);

        if (usernameExists) {
          alert(
            "The username is already taken. Please choose a different one."
          );
          return;
        }

        if (emailExists) {
          alert(
            "The email is already registered. Please use a different email."
          );
          return;
        }

        // If no matches, proceed to create a new user
        const newUser = { username, email, password };

        const signupResponse = await fetch(USER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (signupResponse.ok) {
          alert("Signup successful! Welcome to the platform! Login to Confirm your Bokkings");
          e.target.reset();
          handleSignInClick(); // Switch to the login view
        } else {
          alert("Failed to sign up! Please try again later.");
        }
      } else {
        alert("Failed to fetch existing users! Please try again later.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert(
        "An error occurred while signing up! Please check your internet connection."
      );
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(USER_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const users = await response.json(); // Fetch users from the server
        const existingUser = users.find(
          (user) => user.username === username && user.password === password
        );

        if (existingUser) {
          alert("Login successful!");

          // ✅ Store user ID in authentication state & localStorage
          setAuth({ id: existingUser.id, username: existingUser.username });
          localStorage.setItem("currentUserId", existingUser.id);

          navigate("/"); // Redirect to the home page
        } else {
          alert("Invalid username or password!");
        }
      } else {
        alert("Failed to retrieve users!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in!");
    }
  };

  return (
    <div ref={wrapperRef} className="wrapper" id="login">
      <div className="form-container sign-up">
        <form onSubmit={handleSignupSubmit}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <input type="text" name="username" required />
            <i className="fas fa-user"></i>
            <label>Username</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fas fa-at"></i>
            <label>Email</label>
          </div>
          <div>
            <button type="button" onClick={sendOtp} className="btn">
              Send OTP
            </button>

            {otpSent && (
              <div className="form-group">
                <input
                  type="text"
                  name="otp"
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter OTP"
                /><br></br>
                <button type="button" onClick={verifyOtp} className="btn">
                  Verify OTP
                </button>
              </div>
            )}
          </div>
          <div className="form-group">
            <input type="password" name="password" required />
            <i className="fas fa-lock"></i>
            <label>Password</label>
          </div>
          <div className="form-group">
            <input type="password" name="confirmPassword" required />
            <i className="fas fa-lock"></i>
            <label>Confirm Password</label>
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
          <div className="link">
            <p>
              You already have an account?{" "}
              <a href="#" className="signin-link" onClick={handleSignInClick}>
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
      <div className="form-container sign-in">
        {!showForgotPassword ? (
          <>
            <form onSubmit={handleLoginSubmit}>
              <h2>Login</h2>
              <div className="form-group">
                <input type="text" name="username" required />
                <i className="fas fa-user"></i>
                <label>Username</label>
              </div>
              <div className="form-group">
                <input type="password" name="password" required />
                <i className="fas fa-lock"></i>
                <label>Password</label>
              </div>
              <div className="forgot-pass">
                <a href="#" onClick={() => setShowForgotPassword(true)}>
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              <div className="link">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="signup-link"
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </>
        ) : (
          <ForgotPassword
            setLoading={setLoading}
            onClose={() => setShowForgotPassword(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
