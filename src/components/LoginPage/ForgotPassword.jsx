import React, { useState } from "react";
import { USER_ENDPOINT } from "../../Api";
import "./Login.css";

const ForgotPassword = ({ setLoading, onClose }) => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Step 1: Check if the user exists
  const checkUserExists = async () => {
    if (!email) {
      alert("⚠️ Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${USER_ENDPOINT}?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const userData = await response.json();
      console.log("User Data Response:", userData); // ✅ Log response

      // ✅ Fix: Check array length instead of `exists`
      if (userData.length > 0) {
        setUserId(userData[0].id); // ✅ Extract userId properly
        sendOtp(); // Proceed to OTP step
      } else {
        alert("❌ User not found! Check your input.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Send OTP
  const sendOtp = async () => {
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
      setLoading(false);
    }
  };

  // ✅ Step 3: Verify OTP
  const verifyOtp = async () => {
    if (!enteredOtp) {
      alert("⚠️ Please enter the OTP.");
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
        alert("✅ OTP Verified! You can now reset your password.");
        setOtpVerified(true);
      } else {
        alert("❌ Invalid OTP! Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("⚠️ Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 4: Reset Password
  const resetPassword = async () => {
    if (!newPassword) {
      alert("⚠️ Please enter a new password.");
      return;
    }

    if (!userId) {
      alert("⚠️ User ID is missing! Please check your flow.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Ensure the correct URL structure with a trailing slash
      const apiUrl = `${USER_ENDPOINT}/${userId}/`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();

      if (data.message === "Password updated successfully") {
        alert(
          "✅ Password updated! You can now log in with your new password."
        );
        onClose();
      } else {
        alert("❌ Password update failed! Try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("⚠️ Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button onClick={checkUserExists} className="btn">
          Send OTP
        </button>
      </div>

      {otpSent && !otpVerified && (
        <>
          {" "}
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
          </div>
          <div>
            <button onClick={verifyOtp} className="btn">
              Verify OTP
            </button>
          </div>
        </>
      )}

      {otpVerified && (
        <>
          <div>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={resetPassword} className="btn">
              Reset Password
            </button>
          </div>
        </>
      )}
      <div>
        <button onClick={onClose} className="btn cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
