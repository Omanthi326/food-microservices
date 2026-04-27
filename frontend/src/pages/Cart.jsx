import React from 'react';
import { useCart } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, decreaseCartItemQuantity, addToCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.priceInCents * item.quantity, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
                        <ShoppingCart className="text-6xl text-white" />
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 py-16'>
                {/* Header */}
                <motion.div 
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                        Shopping Cart
                    </h2>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full'></div>
                </motion.div>

                {/* Cart Items */}
                <motion.div 
                    className='grid md:grid-cols-2 gap-6 mb-12'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {cartItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                variants={itemVariants}
                                layout
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Card className='group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200'>
                                    <div className='flex flex-col md:flex-row h-full'>
                                        {/* Image Section */}
                                        <div className='relative w-full md:w-48 flex-shrink-0 h-48 md:h-full bg-gray-100 overflow-hidden'>
                                            <motion.img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className='w-full h-full object-cover'
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <div className='absolute top-3 right-3'>
                                                <Badge className="bg-orange-500 text-white">
                                                    ⭐ Fresh
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        {/* Content Section */}
                                        <CardContent className='flex-1 p-6 flex flex-col justify-between'>
                                            <div>
                                                <h3 className='text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2'>
                                                    {item.name}
                                                </h3>
                                                
                                                <div className='flex items-center justify-between mb-4'>
                                                    <span className='text-2xl font-bold text-gray-900'>
                                                        ${(item.priceInCents / 100).toFixed(2)}
                                                    </span>
                                                    <Badge className="bg-gray-100 text-gray-700">
                                                        Qty: {item.quantity}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between gap-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon"
                                                        onClick={() => decreaseCartItemQuantity(item._id)}
                                                        className="rounded-lg border-gray-300 hover:border-orange-500 hover:text-orange-500"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <div className='px-3 py-1 bg-orange-50 rounded-lg min-w-[40px] text-center border border-orange-200'>
                                                        <span className='font-semibold text-orange-600'>{item.quantity}</span>
                                                    </div>
                                                    <Button 
                                                        variant="default" 
                                                        size="icon"
                                                        onClick={() => addToCart(item)}
                                                        className="rounded-lg bg-orange-500 hover:bg-orange-600"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-sm text-gray-500'>Subtotal</p>
                                                    <p className='text-lg font-bold text-gray-900'>
                                                        ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Checkout Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className='p-8 md:p-12 border border-gray-200'>
                        <div className='text-center max-w-2xl mx-auto'>
                            <div className='mb-8'>
                                <h3 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Order Summary</h3>
                                <div className='h-1 w-16 bg-orange-500 mx-auto rounded-full'></div>
                            </div>
                            
                            <div className='space-y-6 mb-8 bg-orange-50 rounded-2xl p-6 border border-orange-100'>
                                <div className='flex justify-between items-center text-lg md:text-xl'>
                                    <span className='text-gray-600'>Total Items:</span>
                                    <span className='font-bold text-gray-900'>{totalItems}</span>
                                </div>
                                <div className='border-t border-orange-200 pt-4'>
                                    <div className='flex justify-between items-center text-2xl md:text-3xl font-bold'>
                                        <span className='text-gray-900'>Total Price:</span>
                                        <span className='text-orange-600'>
                                            ${(totalPrice / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-4'>
                                <Button 
                                    onClick={() => navigate('/order-confirmation')} 
                                    size="lg"
                                    className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Proceed to Order
                                </Button>
                                <Button 
                                    onClick={() => navigate('/')} 
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Cart;
