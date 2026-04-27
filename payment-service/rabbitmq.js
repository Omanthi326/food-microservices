import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL, {
      rejectUnauthorized: false  // ← add this for CloudAMQP SSL
    });
    channel = await connection.createChannel();
    await channel.assertQueue("order_updates", { durable: true });
    console.log("✅ RabbitMQ connected in Payment Service");
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
  }
};