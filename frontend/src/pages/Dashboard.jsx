import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Package, CheckCircle, Clock, DollarSign, Eye, Trash2, ArrowLeft, ChevronDown, ChevronUp, Mail, MapPin, Calendar, Play, Truck, ChefHat } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());

    useEffect(() => {
        setLoading(true);

        // Fetch both orders and food items
        Promise.all([
            axios.get('https://api-gateway-production-8d60.up.railway.app/order'),
            axios.get('https://api-gateway-production-8d60.up.railway.app/food')
        ])
            .then(([ordersResponse, foodResponse]) => {
                setOrders(ordersResponse.data);
                setFoodItems(foodResponse.data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error('Error loading data');
                setLoading(false);
            });
    }, []);

    const toggleRow = (orderId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const updateOrderStatus = async (orderId, status, deliveryStatus = null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const updateData = { status };
            if (deliveryStatus) {
                updateData.deliveryStatus = deliveryStatus;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/order/${orderId}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, ...updateData }
                        : order
                )
            );

            toast.success(`Order status updated to ${status}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    // Helper to get food price by name
    const getFoodPrice = (itemName) => {
        const food = foodItems.find(f => f.name === itemName);
        return food ? food.priceInCents : null;
    };

    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || !order.status).length;
    
    // Calculate total revenue - use priceInCents from items or fetch from foodItems
    const totalRevenue = orders.reduce((acc, order) => {
        if (order.totalPrice) {
            return acc + (order.totalPrice / 100);
        } else if (order.items && Array.isArray(order.items)) {
            const orderTotal = order.items.reduce((sum, item) => {
                let priceInCents = null;
                
                // Check if priceInCents exists in item
                if (item.priceInCents) {
                    priceInCents = item.priceInCents;
                } else if (item.price) {
                    // If price is in dollars, convert to cents
                    priceInCents = item.price * 100;
                } else {
                    // Try to get price from foodItems
                    priceInCents = getFoodPrice(item.name);
                }
                
                if (priceInCents) {
                    return sum + ((priceInCents / 100) * (item.quantity || 1));
                }
                return sum;
            }, 0);
            return acc + orderTotal;
        }
        return acc;
    }, 0);

    // Helper function to calculate total quantity in an order
    const getTotalQuantity = (order) => {
        if (!order.items || !Array.isArray(order.items)) return 0;
        return order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    // Helper function to get order total
    const getOrderTotal = (order) => {
        if (order.totalPrice) {
            return order.totalPrice / 100;
        } else if (order.items && Array.isArray(order.items)) {
            return order.items.reduce((sum, item) => {
                let priceInCents = null;
                
                if (item.priceInCents) {
                    priceInCents = item.priceInCents;
                } else if (item.price) {
                    priceInCents = item.price * 100;
                } else {
                    priceInCents = getFoodPrice(item.name);
                }
                
                if (priceInCents) {
                    return sum + ((priceInCents / 100) * (item.quantity || 1));
                }
                return sum;
            }, 0);
        }
        return 0;
    };

    // Helper function to get item price for display
    const getItemPrice = (item) => {
        if (item.priceInCents) {
            return item.priceInCents / 100;
        } else if (item.price) {
            return item.price;
        } else {
            const priceInCents = getFoodPrice(item.name);
            return priceInCents ? priceInCents / 100 : 0;
        }
    };

    // Helper function to get items list
    const getItemsList = (order) => {
        if (!order.items || !Array.isArray(order.items)) return 'N/A';
        if (order.items.length === 0) return 'No items';
        if (order.items.length === 1) return order.items[0].name;
        return `${order.items[0].name} + ${order.items.length - 1} more`;
    };

  return (
        <div className='min-h-screen bg-white'>
      {loading && <Spinner/>}
      
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16'>
        {/* Header Section */}
                <motion.div 
                    className='mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Order Dashboard
          </h1>
                    <p className='text-xl text-gray-600 mb-4'>Monitor and manage customer orders</p>
                    <div className='h-1 w-24 bg-orange-500 rounded-full mb-8'></div>
                    <Button 
                        asChild
                        variant="outline"
                        className='border-gray-300 hover:border-orange-500 hover:text-orange-500'
                    >
                        <Link to="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Admin Panel
                        </Link>
                    </Button>
                </motion.div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                                        <Package className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                                        <h3 className='text-2xl font-bold text-gray-900'>{totalOrders}</h3>
                <p className='text-gray-600'>Total Orders</p>
              </div>
            </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center'>
                                        <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                                        <h3 className='text-2xl font-bold text-gray-900'>{completedOrders}</h3>
                <p className='text-gray-600'>Completed</p>
              </div>
            </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                                        <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                                        <h3 className='text-2xl font-bold text-gray-900'>{pendingOrders}</h3>
                <p className='text-gray-600'>Pending</p>
              </div>
            </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className='border border-gray-200'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                                        <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                                        <h3 className='text-2xl font-bold text-gray-900'>
                                            ${totalRevenue.toFixed(2)}
                </h3>
                <p className='text-gray-600'>Total Revenue</p>
              </div>
            </div>
                            </CardContent>
                        </Card>
                    </motion.div>
        </div>

        {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Card className='border border-gray-200'>
                        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-200'>
                                <h2 className='text-2xl font-bold text-gray-900'>Recent Orders</h2>
            <p className='text-gray-600'>Manage customer orders and deliveries</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
                                    <thead className='bg-orange-50'>
                <tr>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Order #</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Customer</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Items</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Quantity</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Address</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Total</th>
                  <th className='py-4 px-6 text-center text-sm font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                                        {orders.map((order, index) => {
                                            const isExpanded = expandedRows.has(order._id);
                                            return (
                                                <React.Fragment key={order._id}>
                                                    <tr className='hover:bg-gray-50 transition-colors duration-200'>
                                                        <td className='py-4 px-6 text-sm font-medium text-gray-900'>#{index + 1}</td>
                    <td className='py-4 px-6'>
                                                            <div className='flex items-center gap-3'>
                                                                <div className='w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm'>
                                                                    {order.customerEmail?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                                                                    <p className='text-sm font-medium text-gray-900'>{order.customerEmail || 'N/A'}</p>
                          <p className='text-xs text-gray-500'>Customer</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center'>
                                                                    <Package className="h-4 w-4" />
                        </div>
                                                                <span className='text-sm font-medium text-gray-900'>{getItemsList(order)}</span>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                                                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                                                {getTotalQuantity(order)}
                                                            </Badge>
                    </td>
                    <td className='py-4 px-6'>
                                                            <div className='text-sm text-gray-900'>
                        <p className='font-medium'>{order.address?.line1 || 'N/A'}</p>
                        <p className='text-gray-500'>{order.address?.city || ''}, {order.address?.country || ''}</p>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                                                            <span className='text-lg font-bold text-orange-600'>
                                                                ${getOrderTotal(order).toFixed(2)}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                                                            <div className='flex justify-center gap-2'>
                                                                <Button 
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => toggleRow(order._id)}
                                                                    className='border-orange-500 text-orange-600 hover:bg-orange-50'
                                                                >
                                                                    {isExpanded ? (
                                                                        <>
                                                                            <ChevronUp className="h-4 w-4 mr-1" />
                                                                            Hide
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Eye className="h-4 w-4 mr-1" />
                                                                            View
                                                                        </>
                                                                    )}
                                                                </Button>
                                                                <Button 
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className='border-red-500 text-red-600 hover:bg-red-50'
                                                                >
                                                                    <Link to={`/admin/order/delete/${order._id}`}>
                                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                                        Delete
                        </Link>
                                                                </Button>
                      </div>
                    </td>
                  </tr>
                                                    
                                                    {/* Expanded Row Details */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.tr
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <td colSpan={7} className='bg-gray-50 p-6'>
                                                                    <div className='grid md:grid-cols-2 gap-6'>
                                                                        {/* Order Items */}
                                                                        <Card className='border border-gray-200'>
                                                                            <CardContent className='p-6'>
                                                                                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                                                                    <Package className="h-5 w-5 text-orange-500" />
                                                                                    Order Items
                                                                                </h3>
                                                                                <div className='space-y-3'>
                                                                                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                                                                                        order.items.map((item, idx) => {
                                                                                            const itemPrice = getItemPrice(item);
                                                                                            const itemTotal = itemPrice * (item.quantity || 1);
                                                                                            return (
                                                                                                <div key={idx} className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                                                                                                    <div className='flex items-center gap-3'>
                                                                                                        {item.image && (
                                                                                                            <img 
                                                                                                                src={item.image} 
                                                                                                                alt={item.name}
                                                                                                                className='w-12 h-12 object-cover rounded-lg'
                                                                                                            />
                                                                                                        )}
                                                                                                        <div>
                                                                                                            <p className='font-semibold text-gray-900'>{item.name}</p>
                                                                                                            <p className='text-sm text-gray-600'>
                                                                                                                ${itemPrice.toFixed(2)} × {item.quantity || 1}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <p className='font-bold text-orange-600'>
                                                                                                        ${itemTotal.toFixed(2)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    ) : (
                                                                                        <p className='text-gray-500 text-center py-4'>No items found</p>
                                                                                    )}
                                                                                    <div className='pt-3 border-t border-gray-200 mt-3'>
                                                                                        <div className='flex justify-between items-center'>
                                                                                            <span className='font-semibold text-gray-900'>Subtotal:</span>
                                                                                            <span className='font-bold text-orange-600'>
                                                                                                ${getOrderTotal(order).toFixed(2)}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>

                                                                        {/* Order Details */}
                                                                        <Card className='border border-gray-200'>
                                                                            <CardContent className='p-6'>
                                                                                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                                                                    <Mail className="h-5 w-5 text-orange-500" />
                                                                                    Order Details
                                                                                </h3>
                                                                                <div className='space-y-4'>
                                                                                    <div>
                                                                                        <p className='text-sm text-gray-600 mb-1'>Order ID</p>
                                                                                        <p className='font-semibold text-gray-900'>{order.orderId || order._id}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                                                                                            <Mail className="h-4 w-4" />
                                                                                            Customer Email
                                                                                        </p>
                                                                                        <p className='font-semibold text-gray-900'>{order.customerEmail || 'N/A'}</p>
                                                                                    </div>
                                                                                    {order.address && (
                                                                                        <div>
                                                                                            <p className='text-sm text-gray-600 mb-2 flex items-center gap-1'>
                                                                                                <MapPin className="h-4 w-4" />
                                                                                                Delivery Address
                                                                                            </p>
                                                                                            <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
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
                                                                                    {order.createdAt && (
                                                                                        <div>
                                                                                            <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                                                                                                <Calendar className="h-4 w-4" />
                                                                                                Order Date
                                                                                            </p>
                                                                                            <p className='font-semibold text-gray-900'>
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
                                                                                    <div className='space-y-4'>
                                                                                        <div>
                                                                                            <p className='text-sm text-gray-600 mb-2'>Order Status</p>
                                                                                            <Badge className={
                                                                                                order.status === 'completed' || order.status === 'delivered'
                                                                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                                                                    : order.status === 'processing' || order.status === 'preparing'
                                                                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                                                                    : 'bg-orange-100 text-orange-700 border-orange-200'
                                                                                            }>
                                                                                                {order.status || 'Pending'}
                                                                                            </Badge>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className='text-sm text-gray-600 mb-2'>Delivery Status</p>
                                                                                            <Badge className={
                                                                                                order.deliveryStatus === 'delivered'
                                                                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                                                                    : order.deliveryStatus === 'out_for_delivery'
                                                                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                                                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                                                                            }>
                                                                                                {order.deliveryStatus ? order.deliveryStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not Started'}
                                                                                            </Badge>
                                                                                        </div>
                                                                                        
                                                                                        {/* Status Action Buttons */}
                                                                                        <div className='pt-4 border-t border-gray-200'>
                                                                                            <p className='text-sm font-semibold text-gray-700 mb-3'>Update Status</p>
                                                                                            <div className='grid grid-cols-2 gap-2'>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => updateOrderStatus(order._id, 'processing', 'preparing')}
                                                                                                    className='border-blue-500 text-blue-600 hover:bg-blue-50'
                                                                                                    disabled={order.status === 'completed' || order.status === 'delivered'}
                                                                                                >
                                                                                                    <Play className="h-4 w-4 mr-1" />
                                                                                                    Processing
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => updateOrderStatus(order._id, 'preparing', 'preparing')}
                                                                                                    className='border-purple-500 text-purple-600 hover:bg-purple-50'
                                                                                                    disabled={order.status === 'completed' || order.status === 'delivered'}
                                                                                                >
                                                                                                    <ChefHat className="h-4 w-4 mr-1" />
                                                                                                    Preparing
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => updateOrderStatus(order._id, 'ready', 'ready')}
                                                                                                    className='border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                                                                                                    disabled={order.status === 'completed' || order.status === 'delivered'}
                                                                                                >
                                                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                                                    Ready
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => updateOrderStatus(order._id, 'out_for_delivery', 'out_for_delivery')}
                                                                                                    className='border-indigo-500 text-indigo-600 hover:bg-indigo-50'
                                                                                                    disabled={order.status === 'completed' || order.status === 'delivered'}
                                                                                                >
                                                                                                    <Truck className="h-4 w-4 mr-1" />
                                                                                                    Out for Delivery
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    onClick={() => updateOrderStatus(order._id, 'delivered', 'delivered')}
                                                                                                    className='bg-green-500 hover:bg-green-600 text-white col-span-2'
                                                                                                    disabled={order.status === 'completed' || order.status === 'delivered'}
                                                                                                >
                                                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                                                    Mark as Delivered
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        )}
                                                    </AnimatePresence>
                                                </React.Fragment>
                                            );
                                        })}
              </tbody>
            </table>
          </div>
                        </CardContent>
                    </Card>
                </motion.div>

        {orders.length === 0 && !loading && (
                    <motion.div 
                        className='text-center py-16'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='w-32 h-32 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center shadow-lg'>
                            <Package className="h-16 w-16 text-orange-600" />
            </div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-4'>No orders yet</h3>
            <p className='text-gray-600 mb-8'>Orders will appear here when customers place them!</p>
                    </motion.div>
        )}
      </div>
    </div>
    );
};

export default Dashboard;
