import express from "express";
import Order from "../models/orderModel.js";
import crypto from "crypto";
import { auth } from "../middleware/authMiddleware.js";
import { config } from "dotenv";

config();

const router = express.Router();

//fetching all the orders
router.get('/', async (req, res) => {
    const orders = await Order.find();

    res.json(orders);
})

//lookup order by orderId or email (for customers) - using query parameter to avoid route conflicts
router.get('/lookup', async (req, res) => {
    try {
        const identifier = req.query.q || req.query.identifier || '';
        const decodedIdentifier = decodeURIComponent(identifier).trim();
        
        console.log('=== ORDER LOOKUP REQUEST ===');
        console.log('Query parameter:', identifier);
        console.log('Decoded identifier:', decodedIdentifier);
        console.log('Request URL:', req.originalUrl);
        
        if (!decodedIdentifier) {
            return res.status(400).json({ message: 'Please provide a search term (q or identifier parameter)' });
        }
        
        // Try to find by MongoDB _id if it looks like an ObjectId (24 hex characters)
        if (/^[0-9a-fA-F]{24}$/.test(decodedIdentifier)) {
            const orderById = await Order.findById(decodedIdentifier);
            if (orderById) {
                console.log('Found order by _id');
                return res.json([orderById]);
            }
        }
        
        // Try to find by exact orderId match
        let order = await Order.findOne({ orderId: decodedIdentifier });
        if (order) {
            console.log('Found order by orderId');
            return res.json([order]);
        }
        
        // Try to find by partial orderId (in case user enters partial ID)
        if (decodedIdentifier.length >= 8) {
            const ordersByPartialId = await Order.find({ 
                orderId: { $regex: decodedIdentifier, $options: 'i' } 
            }).sort({ createdAt: -1 });
            if (ordersByPartialId.length > 0) {
                console.log('Found orders by partial orderId');
                return res.json(ordersByPartialId);
            }
        }
        
        // Try to find by email (case-insensitive)
        const emailRegex = new RegExp(`^${decodedIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        const ordersByEmail = await Order.find({ 
            customerEmail: emailRegex 
        }).sort({ createdAt: -1 });
        
        if (ordersByEmail.length > 0) {
            console.log('Found orders by email:', ordersByEmail.length);
            return res.json(ordersByEmail);
        }
        
        // If nothing found, return empty array
        console.log('No orders found');
        return res.json([]);
    } catch (error) {
        console.error('Error looking up order:', error);
        res.status(500).json({ message: 'Error looking up order: ' + error.message });
    }
})

//fetching a single order by id
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);

    res.json(order);
})

//updating an existing order
router.put('/:id', auth, async (req, res) => {
    const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true});
    
    res.json(updateOrder);
})

//delete an order
router.delete('/:id', auth, async (req, res) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    res.json(deletedOrder);
})

//creating a new order
router.post('/', async (req, res) => {
    const orderData = req.body;

    // Use provided orderId if available, otherwise generate one
    let orderId = orderData.orderId;
    
    if (!orderId) {
        // Generate a hash-based orderId if not provided
        orderId = crypto.createHash('sha256').update(JSON.stringify(orderData)).digest('hex');
    }

    try {
        const existingOrder = await Order.findOne({ orderId });

        if (existingOrder) {
            // If orderId already exists and was provided, generate a new one
            if (orderData.orderId) {
                orderId = `${orderData.orderId}-${Date.now()}`;
            } else {
                return res.status(409).json({ message: 'Order already exists.' });
            }
        }

        // Remove orderId from orderData to avoid duplication
        const { orderId: _, ...restOrderData } = orderData;
        const order = new Order({ orderId, ...restOrderData });
        
        try {
            await order.save();
            console.log('Order saved with orderId:', orderId);
        } catch (error) {
            console.error('Error saving order: ', error.message);
            return res.status(500).send({ message: 'Error saving order: ' + error.message});
        }

        return res.status(201).json(order);

    } catch (error) {
        console.error('Error finding order: ', error.message);
        return res.status(500).send({ message: 'Error finding order: ' + error.message});
    }
})

export default router;