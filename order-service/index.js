import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import orderRoute from "./routes/orderRoute.js";
import { connectRabbitMQ } from "./rabbitmq.js";
import { metricsMiddleware, metricsEndpoint } from './metrics.js';

config();

const app = express();
app.use(cors());
app.use(metricsMiddleware);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Order DB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Connect RabbitMQ on startup
connectRabbitMQ();

app.use("/order", orderRoute);
app.get('/metrics', metricsEndpoint);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Order Service running on port ${process.env.PORT}`)
);