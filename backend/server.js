const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Allow frontend (React) to connect with credentials
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL (vite default)
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // secure:false for localhost
  })
);

// ========================
// 🔹 Routes
// ========================

// Register
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (row) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.session.user = { id: user.id, email: user.email };
    res.status(200).json({ message: "Login successful", user: req.session.user });
  });
});

// Dashboard (Protected route)
app.get("/api/dashboard", (req, res) => {
  if (req.session.user) {
    res.json({ message: `Welcome, ${req.session.user.email}` });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
