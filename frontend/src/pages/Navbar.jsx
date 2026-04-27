import React, { useState } from 'react';
import { X, Menu as MenuIcon, Search, User } from "lucide-react";
import { Link } from 'react-router-dom';
import ModernLogo from '../components/ModernLogo';
import CartIcon from '../components/CartIcon';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [nav, setNav] = useState(false);

  return (
    <motion.div 
        className='fixed top-0 z-50 w-full bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className='flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto'>
            <Link to="/" className='group'>
                <ModernLogo 
                    size="default" 
                    showText={true} 
                    className="text-white"
                />
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden lg:flex items-center gap-6'>
                <Link 
                    to="/" 
                    className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                >
                    Home
                </Link>
                <Link 
                    to="/" 
                    className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        e.preventDefault();
                        if (window.location.pathname === '/') {
                            const aboutSection = document.getElementById('about-section');
                            if (aboutSection) {
                                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else {
                            window.location.href = '/#about-section';
                        }
                    }}
                >
                    About
                </Link>
                <Link 
                    to="/" 
                    className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        e.preventDefault();
                        if (window.location.pathname === '/') {
                            const menuSection = document.getElementById('menu-section');
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else {
                            window.location.href = '/#menu-section';
                        }
                    }}
                >
                    Menu
                </Link>
                <Link to="/contact" className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'>
                    Contact
                </Link>
                <Link to="/order-status" className='px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'>
                    Track Order
                </Link>
                <Link to="/admin" className='px-4 py-2 rounded-lg text-slate-900 bg-orange-500 hover:bg-orange-600 transition-all duration-200 font-semibold'>
                    Admin Panel
                </Link>
            </nav>

            {/* Icons */}
            <div className='flex items-center gap-3'>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className='text-white hover:bg-white/10 hidden md:flex'
                    aria-label="Search"
                >
                    <Search className="h-5 w-5" />
                </Button>
                <Link to="/cart" className='relative group'>
                    <CartIcon/>
                </Link>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className='text-white hover:bg-white/10 hidden md:flex'
                    aria-label="User"
                >
                    <User className="h-5 w-5" />
                </Button>

                {/* Mobile Menu Button */}
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setNav(!nav)} 
                    className='text-white lg:hidden hover:bg-white/10'
                >
                    {nav ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
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
                <Link 
                    to="/" 
                    className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        setNav(false);
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                >
                    Home
                </Link>
                <Link 
                    to="/" 
                    className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        e.preventDefault();
                        setNav(false);
                        if (window.location.pathname === '/') {
                            const aboutSection = document.getElementById('about-section');
                            if (aboutSection) {
                                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else {
                            window.location.href = '/#about-section';
                        }
                    }}
                >
                    About
                </Link>
                <Link 
                    to="/" 
                    className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={(e) => {
                        e.preventDefault();
                        setNav(false);
                        if (window.location.pathname === '/') {
                            const menuSection = document.getElementById('menu-section');
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else {
                            window.location.href = '/#menu-section';
                        }
                    }}
                >
                    Menu
                </Link>
                <Link 
                    to="/contact" 
                    className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={() => setNav(false)}
                >
                    Contact
                </Link>
                <Link 
                    to="/order-status" 
                    className='w-full px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                    onClick={() => setNav(false)}
                >
                    Track Order
                </Link>
                <Link 
                    to="/admin" 
                    className='w-full px-4 py-2 rounded-lg text-slate-900 bg-orange-500 hover:bg-orange-600 transition-all duration-200 font-semibold mt-2'
                    onClick={() => setNav(false)}
                >
                    Admin Panel
                </Link>
            </nav>
        </div>
    </motion.div>
  );
};

export default Navbar;
