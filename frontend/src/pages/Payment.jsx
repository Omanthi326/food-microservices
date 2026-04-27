import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Loader2, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Payment = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const order = localStorage.getItem('currentOrder');
        if (order) {
            setOrderData(JSON.parse(order));
        } else {
            toast.error('No order found. Redirecting to cart...');
            navigate('/cart');
        }
    }, [navigate]);

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
  if (paymentMethod === 'card') {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      toast.error('Please fill in all card details');
      return;
    }
  }

  setIsProcessing(true);
  toast.loading('Processing payment...', { id: 'payment' });

  try {
    const response = await fetch('http://localhost:3000/stripe/test-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: orderData.shippingDetails.email,
        items: orderData.items,
        address: {
          line1: orderData.shippingDetails.address,
          line2: '',
          city: orderData.shippingDetails.city,
          state: orderData.shippingDetails.state,
          postal_code: orderData.shippingDetails.zipCode,
          country: orderData.shippingDetails.country
        },
        totalPrice: orderData.totalPrice
      })
    });

    if (!response.ok) throw new Error('Payment failed');

    const data = await response.json();
    console.log('✅ Payment successful:', data);

    toast.success('Payment successful!', { id: 'payment' });

    

    setTimeout(() => navigate('/success'), 1000);

  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.', { id: 'payment' });
    setIsProcessing(false);
  }
};

    if (!orderData) {
        return (
            <div className='min-h-screen bg-white flex items-center justify-center'>
                <motion.div 
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className='w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center'
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="h-8 w-8 text-orange-500" />
                    </motion.div>
                    <p className='text-xl text-gray-600'>Loading order details...</p>
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
                        Payment
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>Complete your order with secure payment</p>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full'></div>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                                    <FileText className="h-6 w-6 text-orange-500" />
                                    Order Summary
                                </h2>
                                
                                <div className='space-y-4 mb-6'>
                                    {orderData.items.map((item, index) => (
                                        <div key={index} className='flex items-center justify-between py-3 border-b border-gray-200'>
                                            <div className='flex items-center gap-3'>
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className='w-16 h-16 object-cover rounded-lg'
                                                />
                                                <div>
                                                    <p className='font-semibold text-gray-900'>{item.name}</p>
                                                    <p className='text-sm text-gray-600'>Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className='font-bold text-orange-600'>
                                                ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className='space-y-3 mb-6 bg-orange-50 rounded-lg p-4 border border-orange-100'>
                                    <div className='flex justify-between text-lg'>
                                        <span className='text-gray-600'>Subtotal:</span>
                                        <span className='font-semibold text-gray-900'>${(orderData.totalPrice / 100).toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between text-lg'>
                                        <span className='text-gray-600'>Shipping:</span>
                                        <span className='font-semibold text-orange-600'>FREE</span>
                                    </div>
                                    <div className='flex justify-between text-xl font-bold border-t border-orange-200 pt-3'>
                                        <span className='text-gray-900'>Total:</span>
                                        <span className='text-orange-600'>
                                            ${(orderData.totalPrice / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                                    <h3 className='font-semibold text-gray-900 mb-2'>Shipping to:</h3>
                                    <p className='text-sm text-gray-700'>{orderData.shippingDetails.name}</p>
                                    <p className='text-sm text-gray-700'>{orderData.shippingDetails.address}</p>
                                    <p className='text-sm text-gray-700'>
                                        {orderData.shippingDetails.city}, {orderData.shippingDetails.state} {orderData.shippingDetails.zipCode}
                                    </p>
                                    <p className='text-sm text-gray-700'>{orderData.shippingDetails.country}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                                    <CreditCard className="h-6 w-6 text-orange-500" />
                                    Payment Method
                                </h2>

                                <div className='space-y-6'>
                                    {/* Payment Method Selection */}
                                    <div>
                                        <label className='block text-sm font-semibold text-gray-700 mb-3'>
                                            Choose Payment Method
                                        </label>
                                        <div className='space-y-3'>
                                            <label className='flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors bg-white'>
                                                <input
                                                    type='radio'
                                                    name='paymentMethod'
                                                    value='card'
                                                    checked={paymentMethod === 'card'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className='mr-3 w-5 h-5 text-orange-500 focus:ring-orange-500'
                                                />
                                                <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                                                <span className='text-lg text-gray-900'>Credit/Debit Card</span>
                                            </label>
                                            <label className='flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors bg-white'>
                                                <input
                                                    type='radio'
                                                    name='paymentMethod'
                                                    value='paypal'
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className='mr-3 w-5 h-5 text-orange-500 focus:ring-orange-500'
                                                />
                                                <span className='text-lg text-gray-900'>PayPal</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Card Details (if card selected) */}
                                    {paymentMethod === 'card' && (
                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                    Card Number
                                                </label>
                                                <input
                                                    type='text'
                                                    name='cardNumber'
                                                    value={cardDetails.cardNumber}
                                                    onChange={handleCardInputChange}
                                                    placeholder='1234 5678 9012 3456'
                                                    maxLength={19}
                                                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                />
                                            </div>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name='expiryDate'
                                                        value={cardDetails.expiryDate}
                                                        onChange={handleCardInputChange}
                                                        placeholder='MM/YY'
                                                        maxLength={5}
                                                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                                        CVV
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name='cvv'
                                                        value={cardDetails.cvv}
                                                        onChange={handleCardInputChange}
                                                        placeholder='123'
                                                        maxLength={4}
                                                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Notice */}
                                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                                        <div className='flex items-center gap-2'>
                                            <Lock className="h-5 w-5 text-orange-600" />
                                            <p className='text-sm text-orange-800'>
                                                Your payment information is secure and encrypted
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pay Button */}
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        size="lg"
                                        className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 h-12 text-lg font-semibold'
                                    >
                                        {isProcessing ? (
                                            <div className='flex items-center justify-center'>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5 mr-2" />
                                                Pay ${(orderData.totalPrice / 100).toFixed(2)}
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={() => navigate('/order-confirmation')}
                                        variant="outline"
                                        size="lg"
                                        className='w-full border-gray-300 hover:border-orange-500 hover:text-orange-500'
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Back to Order Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
