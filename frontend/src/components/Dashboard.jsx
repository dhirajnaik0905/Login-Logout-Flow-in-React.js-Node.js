import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard({ setAuth }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setAuth(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Dashboard 🎉</h2>
        <p>You are successfully logged in!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
