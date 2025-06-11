import { useState } from "react";
import "./Login.css";
import API from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../../store/zustand.js";
import ButtonLoader from "../../component/ButtonLoader/ButtonLoader.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      if(res.data.success){
        toast.success(res.data.message || "Login successful");
      }else{
        toast.error(res.data.message || "Something went wrong")
      }
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login_wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? <ButtonLoader /> : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
