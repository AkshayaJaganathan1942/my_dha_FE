import React, { useRef, useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from "../../AuthContext";

const Login = () => {
  const { setAuth } = useAuth();
  const wrapperRef = useRef(null);
  const [signupData, setSignupData] = useState(
    JSON.parse(localStorage.getItem("signupData")) || []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || 'login';
  const navigate = useNavigate();
  
  useEffect(() => {
    if (type === 'login') {
      wrapperRef.current.classList.add('animated-signup');
      wrapperRef.current.classList.remove('animated-signin');
    } else {
      wrapperRef.current.classList.add('animated-signin');
      wrapperRef.current.classList.remove('animated-signup');
    }
  }, [type]);
  

  
  const handleSignUpClick = () => {
    
    wrapperRef.current.classList.add("animated-signin"); // Add the animation class for sign-up
    wrapperRef.current.classList.remove("animated-signup"); // Remove the opposite class
  };
  
  const handleSignInClick = () => {
    wrapperRef.current.classList.add("animated-signup"); // Add the animation class for login
    wrapperRef.current.classList.remove("animated-signin"); // Remove the opposite class
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format!");
      return;
    }
  

    if (password === confirmPassword) {
      const existingUser = signupData.find((user) => user.username === username);
      if (!existingUser) {
        const newUser = { username, email, password };
        setSignupData([...signupData, newUser]);
        localStorage.setItem(
          "signupData",
          JSON.stringify([...signupData, newUser])
        );
        alert("Signup successful!");
        e.target.reset();
        handleSignInClick();
      } else {
        alert("Username already exists!");
      }
    } else {
      alert("Passwords don't match!");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    const existingUser = signupData.find(
      (user) => user.username === username && user.password === password
    );
  
    if (existingUser) {
      alert("Login successful!");
      setAuth({ username }); // Save username in auth context
      navigate('/'); // Redirect to the home page
    } else {
      alert("Invalid username or password!");
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
            <input type="email" name="email" required />
            <i className="fas fa-at"></i>
            <label>Email</label>
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
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">
          Login
          </button>
          <div className="link">
            <p>
              Don't have an account?{" "}
              <a href="#" className="signup-link" onClick={handleSignUpClick}>
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
