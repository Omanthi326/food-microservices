import express from "express";
import { config } from "dotenv";
import cors from "cors";
import stripeRoute from "./routes/stripeRoute.js";
import { webhookRouter } from "./webhooks/webhookHandler.js";
import { connectRabbitMQ, publishOrderUpdate } from "./rabbitmq.js";
import { metricsMiddleware, metricsEndpoint } from './metrics.js';

config();

const app = express();
app.use(cors());
app.use(metricsMiddleware);


// ⚠️ Raw body MUST be before express.json()
app.use("/webhooks/stripe", express.raw({ type: "*/*" }));
app.use(express.json());

// Connect RabbitMQ on startup
connectRabbitMQ();

// Routes
app.use("/stripe", stripeRoute);
app.use("/webhooks/stripe", webhookRouter);

// ✅ Test payment endpoint - triggers RabbitMQ flow
app.post("/stripe/test-payment", async (req, res) => {
  try {
    const { customerEmail, items, address, totalPrice } = req.body;

    const orderData = {
      orderId: `QD-${Date.now()}`,
      customerEmail,
      items,
      address,
      totalPrice,
      status: "processing"
    };

    // Publish to RabbitMQ
    await publishOrderUpdate(orderData);
    console.log("✅ Order published to RabbitMQ:", orderData.orderId);

    res.json({ 
      success: true, 
      orderId: orderData.orderId,
      message: "Payment processed and order published to RabbitMQ"
    });
  } catch (error) {
    console.error("❌ Payment error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/metrics', metricsEndpoint);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Payment Service running on port ${process.env.PORT}`)
);