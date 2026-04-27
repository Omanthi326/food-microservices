import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ModernLogo from '../components/ModernLogo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const [loading, setLoading] = useState(false);

    const changeInputHandler = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value});
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if(userData.password !== userData.password2) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            await axios.post('http://localhost:3000/auth/register',
                {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password
                },
                config
            );

            toast.success('Registration successful! Redirecting... 🎉');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Registration failed. Please try again.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50 flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full'
            >
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className='flex justify-center'>
                            <ModernLogo size="large" showText={true} />
                        </div>
                        <CardTitle className="text-4xl">Create Account</CardTitle>
                        <CardDescription className="text-base">
                            Join us and start your culinary journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form className='space-y-5' onSubmit={submitHandler}>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <User className="h-4 w-4" />
                                    Full Name
                                </label>
                                <Input 
                                    type="text" 
                                    placeholder='Enter your full name' 
                                    name="name" 
                                    value={userData.name} 
                                    onChange={changeInputHandler}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <Input 
                                    type="email" 
                                    placeholder='Enter your email' 
                                    name="email" 
                                    value={userData.email} 
                                    onChange={changeInputHandler}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <Lock className="h-4 w-4" />
                                    Password
                                </label>
                                <Input 
                                    type="password" 
                                    placeholder='Create a password' 
                                    name="password" 
                                    value={userData.password} 
                                    onChange={changeInputHandler}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <Lock className="h-4 w-4" />
                                    Confirm Password
                                </label>
                                <Input 
                                    type="password" 
                                    placeholder='Confirm your password' 
                                    name="password2" 
                                    value={userData.password2} 
                                    onChange={changeInputHandler}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className='w-full gap-2'
                                disabled={loading}
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-5 w-5" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className='mt-6 text-center'>
                            <p className='text-gray-600'>Already have an account?</p>
                            <Link 
                                to="/login" 
                                className='text-purple-600 hover:text-purple-800 font-semibold text-lg transition-colors duration-200 inline-block mt-2'
                            >
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
