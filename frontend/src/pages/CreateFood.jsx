import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, DollarSign, Upload, Save, Eye, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import Spinner from '../components/Spinner';
import ModernLogo from '../components/ModernLogo';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [priceInCents, setPriceInCents] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setImg(selectedFile);
        if(selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setImgPreview(null);
        }
    };

    const uploadFile = async () => {
        if (!img) {
            toast.error('No image selected');
            return;
        }

        const token = localStorage.getItem('token');
        if(!token) {
            console.log('No token found');
            toast.error('Authentication required');
            return;
        }
        
        console.log('Token from localStorage:', token);

        const data = new FormData();
        data.append('file', img);

        try {
            const uploadUrl = 'http://localhost:3000/upload-image';
            const res = await axios.post(uploadUrl, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const { secure_url } = res.data;
            console.log('Uploaded image url: ', secure_url);
            toast.success('Image uploaded successfully');
            return secure_url;
        } catch (error) {
            console.error('Upload error', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSaveFood = async () => {
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

        setLoading(true);

        try {
            const uploadedImageUrl = await uploadFile();
            if (!uploadedImageUrl) {
                throw new Error('Image upload failed');
            }

            const formData = {
                name,
                priceInCents,
                image: uploadedImageUrl
            };

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication failed');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            console.log(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/food`, formData, config);

            toast.success('Food saved successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving food: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
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
                        Create New Food Item
                    </h1>
                    <p className='text-xl text-gray-600 mb-4'>Add a delicious new item to your menu</p>
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

                                    <div>
                                        <label htmlFor='img' className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                            <Upload className="h-5 w-5 text-orange-500" />
                                            <span>Upload Image</span>
                                        </label>
                                        <input
                                            id="img"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className='w-full border-2 border-gray-300 border-dashed rounded-lg px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100'
                                            required
                                        />
                                        <p className='text-sm text-gray-500 mt-2'>PNG, JPG, JPEG up to 5MB</p>
                                    </div>

                                    <Button 
                                        onClick={handleSaveFood}
                                        size="lg"
                                        className='w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold'
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Food Item
                                    </Button>
                                </div>

                                {/* Right Column - Image Preview */}
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                                            <Eye className="h-5 w-5 text-orange-500" />
                                            <span>Image Preview</span>
                                        </h3>
                                        
                                        {imgPreview ? (
                                            <div className='relative group'>
                                                <div className='bg-orange-50 rounded-lg p-6 border-2 border-dashed border-orange-200'>
                                                    <img 
                                                        src={imgPreview} 
                                                        alt="Preview" 
                                                        className='w-full h-80 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300' 
                                                    />
                                                    <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md'>
                                                        <span className='text-sm font-bold text-gray-800'>Preview</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='bg-gray-100 rounded-lg p-12 border-2 border-dashed border-gray-300 text-center'>
                                                <div className='w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center'>
                                                    <Upload className="h-12 w-12 text-orange-600" />
                                                </div>
                                                <p className='text-gray-500 text-lg'>No image selected</p>
                                                <p className='text-gray-400 text-sm mt-2'>Upload an image to see preview</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Food Info Preview */}
                                    {name && priceInCents && (
                                        <Card className='bg-orange-50 border-orange-200'>
                                            <CardContent className='p-6'>
                                                <h4 className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                                    <FileText className="h-5 w-5 text-orange-500" />
                                                    <span>Item Preview</span>
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

export default CreateFood;
