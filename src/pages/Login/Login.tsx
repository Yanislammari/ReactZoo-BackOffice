import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { toast } from "sonner";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const authService = new AuthService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const session = await authService.login(email, password);
      const user = await authService.getMe(session);
      localStorage.setItem("User", JSON.stringify(user));
      toast.success("Login successful!");
      navigate("/");
      return;
    }
    catch (error: any) {
      switch (error.message) {
        case "LOGIN_FAILED":
          toast.error("Login failed. Please check your credentials.");
          break;

        case "ERROR_SERVOR":
          toast.error("Server error. Please try again later.");
          break;
          
        default:
          toast.error("An unexpected error occurred. Please try again.");
          break;
      }
      return;
    }
  }

  return (
    <div className="Login">
      <div className="hero-banner-login">
        <div className="hero-banner-top-login">
          <h1 className="login-logo" onClick={() => navigate("/")}>ZooAdmin</h1>
        </div>
        <div className="form-container">
          <h2>Sign up Admin</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <p className="forgot-password">Password forgotten ?</p>
            <button className="submit-btn" type="submit">Sign up</button>
          </form>
          <p className="admin-note">Interface reserved for zoo administrators</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
