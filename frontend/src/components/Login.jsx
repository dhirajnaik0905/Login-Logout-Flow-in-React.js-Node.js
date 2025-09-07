import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      if (res.status === 200) {
        setAuth(true);
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p onClick={() => navigate("/register")}>
          Don’t have an account? <b>Register</b>
        </p>
      </div>
    </div>
  );
}

export default Login;
