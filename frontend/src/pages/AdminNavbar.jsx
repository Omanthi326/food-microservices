import React, { useState } from 'react';
import { X, Menu, BarChart3, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import ModernLogo from '../components/ModernLogo';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const AdminNavbar = () => {
    const [nav, setNav] = useState(false);
    const toggleNav = () => setNav(!nav);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = "/";
    };

    const loggedIn = !!localStorage.getItem('token');

    return (
        <motion.div 
            className='fixed top-0 z-50 w-full bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg'
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto'>
                <div className='flex items-center gap-4'>
                    <Link to="/" className='group'>
                        <ModernLogo 
                            size="default" 
                            showText={true} 
                            className="text-white"
                        />
                    </Link>
                    <div className='hidden md:block'>
                        <span className='text-white/80 text-sm font-medium px-3 py-1 bg-orange-500/20 rounded-lg border border-orange-500/30'>
                            Admin Panel
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex items-center gap-4'>
                        {loggedIn ? (
                            <>
                                <Link 
                                    to="/admin" 
                                    className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Panel
                                </Link>
                                <Link 
                                    to="/admin/dashboard" 
                                    className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className='text-white hover:bg-red-500/20 hover:text-red-300 flex items-center gap-2'
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost"
                        size="icon"
                        onClick={toggleNav} 
                        className='text-white lg:hidden hover:bg-white/10'
                    >
                        {nav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <nav 
                    className={`
                        ${nav ? "flex" : "hidden"} 
                        absolute lg:hidden
                        w-full 
                        flex-col 
                        items-start
                        top-full left-0 right-0 
                        py-4 px-4
                        z-20
                        bg-slate-900
                        backdrop-blur-lg
                        rounded-b-xl
                        shadow-xl
                    `}
                > 
                    {loggedIn ? (
                        <>
                            <Link 
                                to="/admin" 
                                className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                                onClick={() => setNav(false)}
                            >
                                <BarChart3 className="h-4 w-4" />
                                Panel
                            </Link>
                            <Link 
                                to="/admin/dashboard" 
                                className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                                onClick={() => setNav(false)}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Button
                                onClick={() => {
                                    logout();
                                    setNav(false);
                                }}
                                variant="ghost"
                                className='w-full justify-start text-white hover:bg-red-500/20 hover:text-red-300 flex items-center gap-2'
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link 
                            to="/login" 
                            className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium flex items-center gap-2'
                            onClick={() => setNav(false)}
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </motion.div>
    );
};

export default AdminNavbar;
