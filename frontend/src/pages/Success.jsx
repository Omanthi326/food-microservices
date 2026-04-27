import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const session_id = new URLSearchParams(location.search).get('session_id');

    const orderId = useMemo(() => `QD-${Math.floor(100000 + Math.random() * 900000)}`, []);

    const postOrderToDatabase = async (postData) => {
        try {
            console.log('Saving order to database:', postData);
            
            const response = await fetch('http://localhost:3000/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', response.status, errorText);
                throw new Error(`Failed to save order to database: ${response.status} ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Order saved to database successfully: ', responseData);
            toast.success('Order confirmed successfully!');
        } catch (error) {
            console.error('Error posting order to database: ', error);
            toast.error('Error saving order. Please contact support.');
        }
    };

    useEffect(() => {
        // Check if we have order data from the new flow
        const orderData = localStorage.getItem('currentOrder');
        console.log('Order data from localStorage:', orderData);
        
        if (orderData) {
            try {
                const order = JSON.parse(orderData);
                console.log('Parsed order:', order);
                
                const formattedOrderDetails = {
                    orderId: orderId, // Include the user-friendly orderId
                    customerEmail: order.shippingDetails.email,
                    items: order.items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        priceInCents: item.priceInCents,
                        image: item.image
                    })),
                    address: {
                        line1: order.shippingDetails.address,
                        line2: '',
                        city: order.shippingDetails.city,
                        state: order.shippingDetails.state,
                        postal_code: order.shippingDetails.zipCode,
                        country: order.shippingDetails.country
                    },
                    totalPrice: order.totalPrice,
                    status: 'pending',
                    deliveryStatus: 'not_started'
                };
                
                console.log('Formatted order details:', formattedOrderDetails);
                setOrderDetails(formattedOrderDetails);
                
                
                
                localStorage.removeItem('currentOrder');
                return;
            } catch (error) {
                console.error('Error parsing order data:', error);
            }
        }

        // Fallback to Stripe session for old flow
        const fetchSessionDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/stripe/api/session/${session_id}`);
                if (!response.ok) {
                    throw new Error('Response was not ok');
                }

                const data = await response.json();
                setOrderDetails(data);
                postOrderToDatabase(data);

                localStorage.removeItem('cartItems');
            } catch (error) {
                console.error('Failed to fetch session details: ', error);
            }
        };
        
        if (session_id) {
            fetchSessionDetails();
        }
    }, [session_id]);

    const totalItems = orderDetails && Array.isArray(orderDetails.items) 
        ? orderDetails.items.reduce((acc, i) => acc + (i.quantity || 0), 0) 
        : 0;
    
    const totalPrice = orderDetails && Array.isArray(orderDetails.items)
        ? orderDetails.items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0)
        : 0;

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Success Header */}
                <motion.div 
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='relative w-24 h-24 mx-auto mb-6'
                    >
                        <div className='w-full h-full rounded-full bg-orange-100 flex items-center justify-center shadow-lg ring-4 ring-orange-50'>
                            <CheckCircle className="h-12 w-12 text-orange-600" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className='absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md'
                        >
                            <CheckCircle className="h-5 w-5" />
                        </motion.div>
                    </motion.div>
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>Order Confirmed</h1>
                    <p className='text-xl text-gray-600 mb-2'>Thank you for your order. We're getting it ready right away.</p>
                    <p className='text-sm text-gray-500'>Order ID: <span className='font-semibold text-gray-700'>{orderId}</span></p>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full mt-4'></div>
                </motion.div>

                {/* Order Details Card */}
                {orderDetails ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className='border border-gray-200 mb-8'>
                            <CardContent className='p-6'>
                                <div className='space-y-8'>
                                    {/* Summary */}
                                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                        <div className='rounded-lg border border-gray-200 p-4 bg-orange-50'>
                                            <p className='text-xs uppercase tracking-wide text-gray-600 mb-1'>Items</p>
                                            <p className='text-2xl font-bold text-gray-900'>{totalItems}</p>
                                        </div>
                                        <div className='rounded-lg border border-gray-200 p-4 bg-orange-50'>
                                            <p className='text-xs uppercase tracking-wide text-gray-600 mb-1'>Total</p>
                                            <p className='text-2xl font-bold text-orange-600'>${(totalPrice / 100).toFixed(2)}</p>
                                        </div>
                                        <div className='rounded-lg border border-gray-200 p-4 bg-orange-50'>
                                            <p className='text-xs uppercase tracking-wide text-gray-600 mb-1'>Status</p>
                                            <p className='text-2xl font-bold text-green-600'>Confirmed</p>
                                        </div>
                                    </div>

                                    {/* ETA Card */}
                                    <div className='rounded-lg border border-orange-200 p-4 bg-orange-50 flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center'>
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className='text-sm text-gray-600'>Estimated delivery</p>
                                                <p className='font-semibold text-gray-900'>25–35 minutes</p>
                                            </div>
                                        </div>
                                        <div className='hidden sm:block text-sm text-gray-600'>We'll notify you if there's an update</div>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className='flex items-center gap-4 sm:gap-6'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-8 h-8 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center font-semibold'>1</div>
                                            <span className='text-sm font-medium text-gray-900'>Confirmed</span>
                                        </div>
                                        <div className='h-px flex-1 bg-gray-200'></div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm flex items-center justify-center font-semibold'>2</div>
                                            <span className='text-sm text-gray-600'>Preparing</span>
                                        </div>
                                        <div className='h-px flex-1 bg-gray-200'></div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-sm flex items-center justify-center font-semibold'>3</div>
                                            <span className='text-sm text-gray-600'>On the way</span>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className='text-center pt-4 border-t border-gray-200'>
                                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Order Confirmation</h2>
                                        <p className='text-gray-600'>
                                            A confirmation has been sent to <span className='font-semibold text-gray-900'>{orderDetails.customerEmail || 'your email'}</span>
                                        </p>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Items</h3>
                                        <div className='space-y-3'>
                                            {orderDetails.items && orderDetails.items.length > 0 ? (
                                                orderDetails.items.map((item, index) => (
                                                    <div key={index} className='rounded-lg border border-gray-200 p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center'>
                                                                <Package className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <p className='font-medium text-gray-900'>{item.name}</p>
                                                                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='font-semibold text-gray-900'>${(item.price / 100).toFixed(2)}</p>
                                                            <p className='text-xs text-gray-500'>per item</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className='text-gray-500 text-center py-4'>No items found in this order.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-3'>Delivery Address</h3>
                                        <div className='rounded-lg border border-gray-200 p-4 bg-gray-50'>
                                            {orderDetails.address ? (
                                                <div className='space-y-2 text-gray-700'>
                                                    <p><span className='text-gray-500 font-medium'>Address:</span> {orderDetails.address.line1}</p>
                                                    {orderDetails.address.line2 && (
                                                        <p><span className='text-gray-500 font-medium'>Apt/Suite:</span> {orderDetails.address.line2}</p>
                                                    )}
                                                    <p><span className='text-gray-500 font-medium'>Location:</span> {`${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.postal_code}`}</p>
                                                    <p><span className='text-gray-500 font-medium'>Country:</span> {orderDetails.address.country}</p>
                                                </div>
                                            ) : (
                                                <p className='text-gray-500'>Shipping address not available.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className='rounded-lg border border-green-200 p-4 bg-green-50'>
                                        <p className='text-sm text-gray-700'>Status: <span className='font-semibold text-green-700'>Confirmed</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        className='text-center py-12'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Loader2 className="w-14 h-14 mx-auto mb-4 text-orange-500 animate-spin" />
                        <p className='text-gray-700 font-medium'>Loading order details...</p>
                    </motion.div>
                )}

                {/* Action Button */}
                <motion.div 
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Button 
                        onClick={() => navigate('/')}
                        size="lg"
                        className='bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg font-semibold'
                    >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Continue Shopping
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Success;
