import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { email, password });
      if (res.status === 201) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      alert("Error registering user.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
        </form>
        <p onClick={() => navigate("/login")}>
          Already have an account? <b>Login</b>
        </p>
      </div>
    </div>
  );
}

export default Register;
