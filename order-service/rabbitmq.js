import amqp from "amqplib";
import Order from "./models/orderModel.js";

let channel;
let connection;

export const connectRabbitMQ = async () => {
  try {
    console.log("🔄 Connecting to CloudAMQP...");

    connection = await amqp.connect(process.env.RABBITMQ_URL, {
      rejectUnauthorized: false,
      heartbeat: 60
    });

    connection.on("error", (err) => {
      console.error("❌ Connection error:", err.message);
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on("close", () => {
      console.log("🔄 Reconnecting...");
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    channel = await connection.createChannel();
    await channel.assertQueue("order_updates", { durable: true });
    console.log("✅ CloudAMQP connected successfully!");
    console.log("👂 Waiting for payment events...");

    // ✅ THIS IS THE MISSING PART - consume messages!
    channel.consume("order_updates", async (msg) => {
      if (msg) {
        try {
          const orderData = JSON.parse(msg.content.toString());
          console.log("📥 Received payment event:", orderData.orderId);

          const existingOrder = await Order.findOne({
            orderId: orderData.orderId
          });

          if (!existingOrder) {
            const order = new Order(orderData);
            await order.save();
            console.log("✅ Order saved from RabbitMQ:", orderData.orderId);
          } else {
            await Order.findOneAndUpdate(
              { orderId: orderData.orderId },
              { status: orderData.status },
              { new: true }
            );
            console.log("✅ Order updated:", orderData.orderId);
          }

          channel.ack(msg);
        } catch (error) {
          console.error("❌ Error processing:", error.message);
          channel.nack(msg);
        }
      }
    });

  } catch (error) {
    console.error("❌ RabbitMQ error:", error.message);
    channel = null;
    setTimeout(connectRabbitMQ, 5000);
  }
};