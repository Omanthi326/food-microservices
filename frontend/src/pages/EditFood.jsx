import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { ArrowLeft, Utensils, DollarSign, Save, Eye, FileText, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import Spinner from '../components/Spinner';
import ModernLogo from '../components/ModernLogo';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const EditFood = () => {
    const [name, setName] = useState('');
    const [priceInCents, setPriceInCents] = useState('');
    const [image, setImage] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/food/${id}`)
            .then((response) => {
                const data = response.data;
                setName(data.name);
                setPriceInCents(data.priceInCents);
                setImage(data.image);
                setOriginalData(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                toast.error('Error loading food item');
            });
    }, [id]);

    const handleEditFood = () => {
        if (!name || !priceInCents) {
            toast.error('Please fill all required fields');
            return;
        }

        const price = parseInt(priceInCents);
        if (isNaN(price) || price <= 0) {
            toast.error('Price must be a positive number');
            return;
        }

        if (name.length < 2 || name.length > 30) {
            toast.error('Food name must be between 2 and 30 characters');
            return;
        }

        const data = { name, priceInCents };
        setLoading(true);
        axios
            .put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/food/${id}`, data, config)
            .then(() => {
                setLoading(false);
                toast.success('Food edited successfully');
                navigate('/admin');
            })
            .catch((error) => {
                setLoading(false);
                toast.error('Error editing food: ' + (error.response?.data?.message || error.message));
                console.log(error);
            });
    };

    return (
        <div className='min-h-screen bg-white'>
            {loading && <Spinner/>}

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16'>
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
                        Edit Food Item
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>Update your menu item details</p>
                    <div className='h-1 w-24 bg-orange-500 mx-auto rounded-full mb-8'></div>
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

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className='border border-gray-200'>
                        <CardContent className='p-8'>
                            <div className='grid md:grid-cols-2 gap-8'>
                                {/* Left Column - Form */}
                                <div className='space-y-6'>
                                    <div>
                                        <label htmlFor='name' className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                            <Utensils className="h-5 w-5 text-orange-500" />
                                            <span>Food Name</span>
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter food name (e.g., Margherita Pizza)"
                                            className='h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor='priceInCents' className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                            <DollarSign className="h-5 w-5 text-orange-500" />
                                            <span>Price (in cents)</span>
                                        </label>
                                        <Input
                                            id="priceInCents"
                                            type="number"
                                            value={priceInCents}
                                            onChange={(e) => setPriceInCents(e.target.value)}
                                            placeholder="Enter price in cents (e.g., 1299 for $12.99)"
                                            className='h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                            required
                                        />
                                        <p className='text-sm text-gray-500 mt-2'>Example: 1299 = $12.99</p>
                                    </div>

                                    <Button 
                                        onClick={handleEditFood}
                                        size="lg"
                                        className='w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold'
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>

                                {/* Right Column - Current Item Preview */}
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                                            <Eye className="h-5 w-5 text-orange-500" />
                                            <span>Current Item</span>
                                        </h3>
                                        
                                        {originalData && (
                                            <div className='relative group'>
                                                <div className='bg-orange-50 rounded-lg p-6 border-2 border-dashed border-orange-200'>
                                                    <img 
                                                        src={originalData.image} 
                                                        alt={originalData.name} 
                                                        className='w-full h-80 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300' 
                                                    />
                                                    <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md'>
                                                        <span className='text-sm font-bold text-gray-800'>Current</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Updated Item Preview */}
                                    {name && priceInCents && (
                                        <Card className='bg-orange-50 border-orange-200'>
                                            <CardContent className='p-6'>
                                                <h4 className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                                    <FileText className="h-5 w-5 text-orange-500" />
                                                    <span>Updated Preview</span>
                                                </h4>
                                                <div className='space-y-2'>
                                                    <div className='flex justify-between'>
                                                        <span className='text-gray-600'>Name:</span>
                                                        <span className='font-semibold text-gray-900'>{name}</span>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <span className='text-gray-600'>Price:</span>
                                                        <span className='font-bold text-orange-600 text-lg'>
                                                            ${(parseInt(priceInCents) / 100).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {originalData && (
                                                        <div className='pt-2 border-t border-gray-200'>
                                                            <div className='flex justify-between text-sm'>
                                                                <span className='text-gray-500'>Original Price:</span>
                                                                <span className='text-gray-500'>
                                                                    ${(originalData.priceInCents / 100).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Changes Summary */}
                                    {originalData && (name !== originalData.name || priceInCents !== originalData.priceInCents) && (
                                        <Card className='bg-yellow-50 border-yellow-200'>
                                            <CardContent className='p-6'>
                                                <h4 className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                                    <Edit className="h-5 w-5 text-orange-500" />
                                                    <span>Changes Summary</span>
                                                </h4>
                                                <div className='space-y-2 text-sm'>
                                                    {name !== originalData.name && (
                                                        <div className='flex justify-between'>
                                                            <span className='text-gray-600'>Name:</span>
                                                            <span className='text-orange-600 font-medium'>
                                                                {originalData.name} → {name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {priceInCents !== originalData.priceInCents && (
                                                        <div className='flex justify-between'>
                                                            <span className='text-gray-600'>Price:</span>
                                                            <span className='text-orange-600 font-medium'>
                                                                ${(originalData.priceInCents / 100).toFixed(2)} → ${(parseInt(priceInCents) / 100).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default EditFood;
