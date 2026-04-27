import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ModernLogo from '../components/ModernLogo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const changeInputHandler = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login', loginData);
            localStorage.setItem('token', response.data.token);
            toast.success('Login successful! 🎉');
            navigate('/admin');
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Login failed. Please try again.';
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
                        <CardTitle className="text-4xl">Welcome Back</CardTitle>
                        <CardDescription className="text-base">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form className='space-y-6' onSubmit={submitHandler}>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <Input 
                                    type="email" 
                                    placeholder='Enter your email' 
                                    name="email" 
                                    value={loginData.email} 
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
                                    placeholder='Enter your password' 
                                    name="password" 
                                    value={loginData.password} 
                                    onChange={changeInputHandler}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <Button 
                                type='submit' 
                                className='w-full gap-2'
                                disabled={loading}
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className='mt-6 text-center'>
                            <p className='text-gray-600'>Don't have an account?</p>
                            <Link 
                                to="/register" 
                                className='text-purple-600 hover:text-purple-800 font-semibold text-lg transition-colors duration-200 inline-block mt-2'
                            >
                                Create Account
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
