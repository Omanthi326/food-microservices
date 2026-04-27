import express from "express";
import Stripe from "stripe";
import { config } from "dotenv";
import { publishOrderUpdate } from "../rabbitmq.js";

config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log('Webhook error:', error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const items = JSON.parse(session.metadata.productDetails);

      const orderData = {
        customerEmail: session.customer_details.email,
        items: items,
        address: {
          line1: session.customer_details.address.line1,
          line2: session.customer_details.address.line2,
          city: session.customer_details.address.city,
          state: session.customer_details.address.state,
          postal_code: session.customer_details.address.postal_code,
          country: session.customer_details.address.country
        },
        status: "processing",
        orderId: session.id
      };

      await publishOrderUpdate(orderData);
      console.log('✅ Order published to RabbitMQ');

    } catch (error) {
      console.error('❌ Error publishing order:', error);
    }
  }

  res.json({ received: true });
});

export { router as webhookRouter };