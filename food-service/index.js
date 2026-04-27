import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Food } from "./models/foodModel.js";
import { auth } from "./middleware/authMiddleware.js";
import { metricsMiddleware, metricsEndpoint } from './metrics.js';
config();
const app = express();
const cloudinaryV2 = cloudinary.v2;
app.use(cors());
app.use(metricsMiddleware);
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Food DB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Cloudinary config
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "food-items",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});
const upload = multer({ storage });

// Upload image
app.post("/upload-image", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ secure_url: req.file.path });
});

// Add this error handler RIGHT after
app.use((err, req, res, next) => {
  console.error("❌ Upload error details:", err.message);
  console.error("❌ Full error:", JSON.stringify(err));
  res.status(500).json({ error: err.message });
});

// Get all food items
app.get("/food", async (req, res) => {
  try {
    const food = await Food.find({});
    res.status(200).json({ data: food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single food item
app.get("/food/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create food item
app.post("/food", auth, async (req, res) => {
  try {
    const { name, priceInCents, image } = req.body;
    if (!name || !priceInCents || !image)
      return res.status(400).json({ message: "Required fields are missing" });

    const food = await Food.create({ name, priceInCents, image });
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update food item
app.put("/food/:id", auth, async (req, res) => {
  try {
    const { name, priceInCents } = req.body;
    if (!name || !priceInCents)
      return res.status(400).json({ message: "Required fields are missing" });

    const result = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ message: "Food not found" });
    res.status(200).json({ message: "Food updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete food item
app.delete("/food/:id", auth, async (req, res) => {
  try {
    const result = await Food.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item successfully deleted", deletedItem: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/metrics', metricsEndpoint);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Food Service running on port ${process.env.PORT}`)
);