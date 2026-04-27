import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, CheckCircle, Clock, Truck, ChefHat, MapPin, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ModernLogo from '../components/ModernLogo';

const OrderStatus = () => {
    const [searchValue, setSearchValue] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            toast.error('Please enter an order ID or email address');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const searchTerm = searchValue.trim();
            console.log('Searching for:', searchTerm);
            const url = `http://localhost:3000/order/lookup?q=${encodeURIComponent(searchTerm)}`;
            console.log('Request URL:', url);
            
            const response = await axios.get(url);
            console.log('Search response:', response.data);
            
            const foundOrders = response.data || [];
            setOrders(foundOrders);
            
            if (foundOrders.length === 0) {
                toast.error('No orders found. Please check your order ID or email address.');
            } else {
                toast.success(`Found ${foundOrders.length} order(s)`);
            }
        } catch (error) {
            console.error('Error searching orders:', error);
            if (error.response && error.response.status === 500) {
                toast.error('Error searching for orders. Please try again.');
            } else {
                toast.error('No orders found. Please check your order ID or email address.');
            }
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'processing':
            case 'preparing':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ready':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'out_for_delivery':
                return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default:
                return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const getDeliveryStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'out_for_delivery':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ready':
            case 'preparing':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing':
            case 'preparing':
                return <ChefHat className="h-5 w-5" />;
            case 'ready':
                return <CheckCircle className="h-5 w-5" />;
            case 'out_for_delivery':
                return <Truck className="h-5 w-5" />;
            case 'delivered':
            case 'completed':
                return <CheckCircle className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

    const getStatusSteps = (order) => {
        const steps = [
            { key: 'pending', label: 'Order Placed', icon: Package },
            { key: 'processing', label: 'Processing', icon: Clock },
            { key: 'preparing', label: 'Preparing', icon: ChefHat },
            { key: 'ready', label: 'Ready', icon: CheckCircle },
            { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
            { key: 'delivered', label: 'Delivered', icon: CheckCircle }
        ];

        const currentStatus = order.status || 'pending';
        const currentIndex = steps.findIndex(step => step.key === currentStatus);
        
        return steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return {
                ...step,
                isCompleted,
                isCurrent
            };
        });
    };

    return (
        <div className='min-h-screen bg-white'>
            {loading && <Spinner/>}
            
            {/* Back to Home Button - Top Left Corner */}
            <div className='fixed top-32 left-4 z-40'>
                <Button 
                    asChild
                    variant="outline"
                    size="sm"
                    className='border-gray-300 hover:border-orange-500 hover:text-orange-500 bg-white shadow-md'
                >
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
            
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16'>
                {/* Header Section */}
                <motion.div 
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className='flex items-center justify-center mb-6'>
                        <ModernLogo size="large" showText={true} />
                    </div>
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                        Track Your Order
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>Enter your order ID or email to check order status</p>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full mb-8'></div>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className='border border-gray-200 mb-8'>
                        <CardContent className='p-6'>
                            <div className='flex gap-4'>
                                <div className='flex-1'>
                                    <Input
                                        type="text"
                                        placeholder="Enter Order ID or Email Address"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className='h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    size="lg"
                                    className='bg-orange-500 hover:bg-orange-600 h-12 px-8'
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orders Results */}
                {searched && orders.length > 0 && (
                    <div className='space-y-6'>
                        {orders.map((order) => {
                            const statusSteps = getStatusSteps(order);
                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card className='border border-gray-200'>
                                        <CardContent className='p-6'>
                                            {/* Order Header */}
                                            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200'>
                                                <div className='flex-1'>
                                                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                                                        Order #{order.orderId?.substring(0, 12) || order._id.substring(0, 12)}
                                                    </h2>
                                                    <p className='text-gray-600 flex items-center gap-2 mb-2'>
                                                        <Mail className="h-4 w-4" />
                                                        {order.customerEmail}
                                                    </p>
                                                    {order.orderId && (
                                                        <p className='text-xs text-gray-500 font-mono break-all'>
                                                            Full ID: {order.orderId}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className='mt-4 md:mt-0'>
                                                    <div className='mb-2'>
                                                        <p className='text-sm text-gray-600 mb-1'>Order Status</p>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {getStatusIcon(order.status)}
                                                            <span className='ml-2'>{order.status || 'Pending'}</span>
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-600 mb-1'>Delivery Status</p>
                                                        <Badge className={getDeliveryStatusColor(order.deliveryStatus)}>
                                                            {order.deliveryStatus ? order.deliveryStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not Started'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Progress */}
                                            <div className='mb-6'>
                                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Progress</h3>
                                                <div className='relative'>
                                                    <div className='flex items-center justify-between'>
                                                        {statusSteps.map((step, index) => {
                                                            const StepIcon = step.icon;
                                                            return (
                                                                <div key={step.key} className='flex flex-col items-center flex-1'>
                                                                    <div className={`
                                                                        w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                                                                        ${step.isCompleted 
                                                                            ? 'bg-orange-500 text-white' 
                                                                            : step.isCurrent
                                                                            ? 'bg-orange-200 text-orange-700 border-2 border-orange-500'
                                                                            : 'bg-gray-200 text-gray-500'
                                                                        }
                                                                    `}>
                                                                        <StepIcon className="h-6 w-6" />
                                                                    </div>
                                                                    <p className={`text-xs text-center font-medium ${
                                                                        step.isCompleted ? 'text-orange-600' : 'text-gray-500'
                                                                    }`}>
                                                                        {step.label}
                                                                    </p>
                                                                    {index < statusSteps.length - 1 && (
                                                                        <div className={`
                                                                            absolute top-6 left-1/2 w-full h-0.5 -z-10
                                                                            ${step.isCompleted ? 'bg-orange-500' : 'bg-gray-200'}
                                                                        `} style={{ 
                                                                            left: `${(index * 100) / (statusSteps.length - 1)}%`,
                                                                            width: `${100 / (statusSteps.length - 1)}%`
                                                                        }}></div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            {order.items && order.items.length > 0 && (
                                                <div className='mb-6'>
                                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Items</h3>
                                                    <div className='space-y-3'>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                                                <div className='flex items-center gap-3'>
                                                                    {item.image && (
                                                                        <img 
                                                                            src={item.image} 
                                                                            alt={item.name}
                                                                            className='w-16 h-16 object-cover rounded-lg'
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <p className='font-semibold text-gray-900'>{item.name}</p>
                                                                        <p className='text-sm text-gray-600'>Quantity: {item.quantity || 1}</p>
                                                                    </div>
                                                                </div>
                                                                {item.priceInCents && (
                                                                    <p className='font-bold text-orange-600'>
                                                                        ${((item.priceInCents / 100) * (item.quantity || 1)).toFixed(2)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Order Details */}
                                            <div className='grid md:grid-cols-2 gap-6'>
                                                {order.address && (
                                                    <div>
                                                        <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                                            <MapPin className="h-5 w-5 text-orange-500" />
                                                            Delivery Address
                                                        </h3>
                                                        <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                                                            <p className='text-sm text-gray-900'>{order.address.line1 || 'N/A'}</p>
                                                            {order.address.line2 && (
                                                                <p className='text-sm text-gray-900'>{order.address.line2}</p>
                                                            )}
                                                            <p className='text-sm text-gray-900'>
                                                                {order.address.city}, {order.address.state} {order.address.postal_code}
                                                            </p>
                                                            <p className='text-sm text-gray-900'>{order.address.country}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div>
                                                    <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                                        <Calendar className="h-5 w-5 text-orange-500" />
                                                        Order Information
                                                    </h3>
                                                    <div className='bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2'>
                                                        {order.createdAt && (
                                                            <div>
                                                                <p className='text-sm text-gray-600'>Order Date</p>
                                                                <p className='text-sm font-semibold text-gray-900'>
                                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {order.totalPrice && (
                                                            <div>
                                                                <p className='text-sm text-gray-600'>Total Amount</p>
                                                                <p className='text-lg font-bold text-orange-600'>
                                                                    ${(order.totalPrice / 100).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {searched && orders.length === 0 && !loading && (
                    <motion.div 
                        className='text-center py-16'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='w-32 h-32 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center shadow-lg'>
                            <Package className="h-16 w-16 text-orange-600" />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-4'>No orders found</h3>
                        <p className='text-gray-600 mb-8'>Please check your order ID or email address and try again.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;

