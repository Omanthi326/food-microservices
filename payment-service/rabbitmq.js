import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    // For CloudAMQP - use this format
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost",
      { 
        heartbeat: 60,
        rejectUnauthorized: false
      }
    );

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err.message);
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on("close", () => {
      console.error("❌ RabbitMQ connection closed, reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    channel = await connection.createChannel();
    await channel.assertQueue("order_updates", { durable: true });
    console.log("✅ RabbitMQ connected successfully!");
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const publishOrderUpdate = async (orderData) => {
  try {
    if (!channel) await connectRabbitMQ();
    channel.sendToQueue(
      "order_updates",
      Buffer.from(JSON.stringify(orderData)),
      { persistent: true }
    );
    console.log("📤 Order published to queue:", orderData.orderId);
  } catch (error) {
    console.error("❌ Failed to publish:", error.message);
    channel = null;
    setTimeout(connectRabbitMQ, 5000);
  }
};