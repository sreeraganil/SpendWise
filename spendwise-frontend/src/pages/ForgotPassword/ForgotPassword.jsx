import { useState } from "react";
import "./forgotPassword.css";
import API from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../component/ButtonLoader/ButtonLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const naviagte = useNavigate();
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful");
      setEmail("");
      setOtp("");
      setNewPassword("");
      naviagte("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot_wrapper">
      <div className="forgot-container">
        <h2>Forgot Password</h2>
        <form
          className="forgot-form"
          onSubmit={otpSent ? resetPassword : requestOtp}
        >
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </>
          )}
          <button id="forgot_btn" type="submit" disabled={loading}>
            {otpSent ? (
              loading ? (
                <ButtonLoader />
              ) : (
                "Reset Password"
              )
            ) : loading ? (
              <ButtonLoader />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
