import amqp from "amqplib";
import Order from "./models/orderModel.js";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("order_updates", { durable: true });

    console.log("✅ RabbitMQ connected in Order Service");
    console.log("👂 Waiting for payment events...");

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
            console.log("✅ Order updated from RabbitMQ:", orderData.orderId);
          }

          channel.ack(msg);
        } catch (error) {
          console.error("❌ Error processing message:", error.message);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};