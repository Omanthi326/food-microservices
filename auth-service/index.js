import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import { auth } from "./middleware/authMiddleware.js";
import { metricsMiddleware, metricsEndpoint } from './metrics.js';

config();
const app = express();
app.use(cors());
app.use(metricsMiddleware);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Auth DB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Register ← no /auth prefix!
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, msg: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Login ← no /auth prefix!
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Get Profile
app.get("/userProfile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get('/metrics', metricsEndpoint);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Auth Service running on port ${process.env.PORT}`)
);