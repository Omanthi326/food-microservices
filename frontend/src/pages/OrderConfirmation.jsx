import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
    const { cartItems, decreaseCartItemQuantity, addToCart, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka'
    });
    
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.priceInCents * item.quantity, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleConfirmOrder = async () => {
        if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.address) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            // Create order data
            const orderData = {
                items: cartItems.map(item => ({
                    name: item.name,
                    priceInCents: item.priceInCents,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingDetails,
                totalPrice,
                status: 'pending'
            };

            // Save order to localStorage for now (you can send to backend later)
            localStorage.setItem('currentOrder', JSON.stringify(orderData));
            
            // Clear cart
            clearCart();
            
            toast.success('Order confirmed! Redirecting to payment...');
            
            // Navigate to payment page
            setTimeout(() => {
                navigate('/payment');
            }, 1000);
            
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Error creating order. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className='min-h-screen bg-white flex items-center justify-center px-4'>
                <motion.div 
                    className='text-center max-w-md'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className='w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl'
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    >
                        <ShoppingBag className="text-6xl text-white" />
                    </motion.div>
                    <h2 className='text-4xl font-bold text-gray-800 mb-4'>Your cart is empty</h2>
                    <p className='text-xl text-gray-600 mb-8'>Add some delicious items to get started!</p>
                    <Button 
                        size="lg"
                        onClick={() => navigate('/')}
                        className="gap-2 bg-orange-500 hover:bg-orange-600"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        Browse Menu
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-white py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <motion.div 
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                        Order Confirmation
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>Review your order and provide shipping details</p>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full'></div>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Order Items */}
                    <motion.div 
                        className='space-y-6'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                                    Your Order Items
                                </h2>
                                
                                <div className='space-y-4'>
                                    {cartItems.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className='bg-gray-50 rounded-lg p-4 flex items-center gap-4 border border-gray-200'
                                        >
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className='w-20 h-20 object-cover rounded-lg'
                                            />
                                            <div className='flex-1'>
                                                <h3 className='font-semibold text-gray-900 mb-1'>{item.name}</h3>
                                                <p className='text-sm text-gray-600'>${(item.priceInCents / 100).toFixed(2)} each</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Button 
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => decreaseCartItemQuantity(item._id)}
                                                    className="rounded-lg border-gray-300 hover:border-orange-500 hover:text-orange-500 h-8 w-8"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className='w-8 text-center font-semibold text-gray-900'>{item.quantity}</span>
                                                <Button 
                                                    size="icon"
                                                    onClick={() => addToCart(item)}
                                                    className="rounded-lg bg-orange-500 hover:bg-orange-600 h-8 w-8"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-bold text-orange-600'>
                                                    ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                    <div className='flex justify-between items-center text-xl font-bold'>
                                        <span className='text-gray-900'>Total:</span>
                                        <span className='text-orange-600'>
                                            ${(totalPrice / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Shipping Details Form */}
                    <motion.div 
                        className='space-y-6'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                                    Shipping Details
                                </h2>
                                
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                Full Name *
                                            </label>
                                            <input
                                                type='text'
                                                name='name'
                                                value={shippingDetails.name}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                placeholder='Enter your full name'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                Email *
                                            </label>
                                            <input
                                                type='email'
                                                name='email'
                                                value={shippingDetails.email}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                placeholder='Enter your email'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                            Phone Number
                                        </label>
                                        <input
                                            type='tel'
                                            name='phone'
                                            value={shippingDetails.phone}
                                            onChange={handleInputChange}
                                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                            placeholder='Enter your phone number'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                            Street Address *
                                        </label>
                                        <input
                                            type='text'
                                            name='address'
                                            value={shippingDetails.address}
                                            onChange={handleInputChange}
                                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                            placeholder='Enter your street address'
                                            required
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                City *
                                            </label>
                                            <input
                                                type='text'
                                                name='city'
                                                value={shippingDetails.city}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                placeholder='City'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                State *
                                            </label>
                                            <input
                                                type='text'
                                                name='state'
                                                value={shippingDetails.state}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                placeholder='State'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                ZIP Code *
                                            </label>
                                            <input
                                                type='text'
                                                name='zipCode'
                                                value={shippingDetails.zipCode}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                placeholder='ZIP'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className='space-y-4'>
                            <Button
                                onClick={handleConfirmOrder}
                                disabled={isProcessing}
                                size="lg"
                                className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 h-12 text-lg font-semibold'
                            >
                                {isProcessing ? 'Processing...' : (
                                    <>
                                        <ShoppingBag className="h-5 w-5 mr-2" />
                                        Confirm Order & Proceed to Payment
                                    </>
                                )}
                            </Button>
                            
                            <Button
                                onClick={() => navigate('/cart')}
                                variant="outline"
                                size="lg"
                                className='w-full border-gray-300 hover:border-orange-500 hover:text-orange-500'
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Cart
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
