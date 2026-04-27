import amqp from "amqplib";

let channel;
let connection;

export const connectRabbitMQ = async () => {
  try {
    console.log("🔄 Connecting to CloudAMQP...");

    const url = process.env.RABBITMQ_URL;
    
    // For CloudAMQP TLS connection
    connection = await amqp.connect(url, {
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

  } catch (error) {
    console.error("❌ RabbitMQ error:", error.message);
    channel = null;
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
    console.log("📤 Order published:", orderData.orderId);
  } catch (error) {
    console.error("❌ Failed to publish:", error.message);
    channel = null;
  }
};