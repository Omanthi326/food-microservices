import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { metricsMiddleware, metricsEndpoint } from './metrics.js';
config();

const app = express();
app.use(cors());
app.use(metricsMiddleware);

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "API Gateway running",
    services: {
      auth: process.env.AUTH_SERVICE,
      food: process.env.FOOD_SERVICE,
      order: process.env.ORDER_SERVICE,
      payment: process.env.PAYMENT_SERVICE,
    },
  });
});

// Auth Service ← strips /auth before forwarding
app.use("/auth", createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { "^/auth": "" },
}));

// User Profile
app.use("/userProfile", createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
}));

// Food Service
app.use("/food", createProxyMiddleware({
  target: process.env.FOOD_SERVICE,
  changeOrigin: true,
}));

// Upload Image
app.use("/upload-image", createProxyMiddleware({
  target: process.env.FOOD_SERVICE,
  changeOrigin: true,
}));

// Order Service
app.use("/order", createProxyMiddleware({
  target: process.env.ORDER_SERVICE,
  changeOrigin: true,
}));

// Payment Service
app.use("/stripe", createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
}));

// Webhooks
app.use("/webhooks", createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
}));

app.get('/metrics', metricsEndpoint);

app.listen(process.env.PORT, () =>
  console.log(`🚀 API Gateway running on port ${process.env.PORT}`)
);