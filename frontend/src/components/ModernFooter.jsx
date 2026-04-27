import React from 'react';
import { Link } from 'react-router-dom';
import ModernLogo from './ModernLogo';
import { MapPin, Phone, Mail, MessageCircle, BookOpen, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const ModernFooter = () => {
    return (
        <footer className='bg-slate-900 text-white border-t border-slate-800'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
                    {/* Logo and Description */}
                    <div className='lg:col-span-1 space-y-6'>
                        <ModernLogo size="large" showText={true} className="text-white" />
                        <p className='text-gray-400 leading-relaxed text-sm max-w-xs'>
                            Delivering the finest culinary experiences right to your doorstep. 
                            Fresh ingredients, authentic flavors, and exceptional service every time.
                        </p>
                        <div className='flex gap-3'>
                            <Link 
                                to='/contact' 
                                className='px-4 py-2 rounded-lg bg-white/10 hover:bg-orange-500 text-white/90 hover:text-white transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium'
                            >
                                <MessageCircle className='h-4 w-4' />
                                <span>Contact Us</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold text-white mb-4'>Quick Links</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link to="/" className='text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center gap-2 group'>
                                    <span className='w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className='text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center gap-2 group'>
                                    <span className='w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className='text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center gap-2 group'>
                                    <span className='w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin" className='text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center gap-2 group'>
                                    <span className='w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold text-white mb-4'>Contact Info</h3>
                        <div className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <div className='mt-1 p-2 bg-orange-500/10 rounded-lg'>
                                    <MapPin className='h-4 w-4 text-orange-500' />
                                </div>
                                <div>
                                    <span className='text-gray-400 text-sm block'>123 Food Street,</span>
                                    <span className='text-gray-400 text-sm block'>Colombo, Sri Lanka</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-orange-500/10 rounded-lg'>
                                    <Phone className='h-4 w-4 text-orange-500' />
                                </div>
                                <a href='tel:+0114898925' className='text-gray-400 hover:text-orange-500 transition-colors text-sm'>+94 11 489 8925</a>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-orange-500/10 rounded-lg'>
                                    <Mail className='h-4 w-4 text-orange-500' />
                                </div>
                                <a href='mailto:info@qdeli.com' className='text-gray-400 hover:text-orange-500 transition-colors text-sm'>info@qdeli.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter & Social */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold text-white mb-4'>Follow Us</h3>
                        <p className='text-gray-400 text-sm mb-4'>
                            Stay connected with us for the latest updates and special offers.
                        </p>
                        <div className='flex gap-3'>
                            <a 
                                href='#' 
                                className='p-3 bg-white/10 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg transition-all duration-200 group'
                                aria-label='Facebook'
                            >
                                <Facebook className='h-5 w-5 group-hover:scale-110 transition-transform' />
                            </a>
                            <a 
                                href='#' 
                                className='p-3 bg-white/10 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg transition-all duration-200 group'
                                aria-label='Instagram'
                            >
                                <Instagram className='h-5 w-5 group-hover:scale-110 transition-transform' />
                            </a>
                            <a 
                                href='#' 
                                className='p-3 bg-white/10 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg transition-all duration-200 group'
                                aria-label='Twitter'
                            >
                                <Twitter className='h-5 w-5 group-hover:scale-110 transition-transform' />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='border-t border-slate-800 mt-12 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-gray-400 text-sm'>
                            © {new Date().getFullYear()} QDeli. All rights reserved.
                        </p>
                        <div className='flex flex-wrap gap-6 justify-center md:justify-end'>
                            <Link to='/privacy' className='text-gray-400 hover:text-orange-500 transition-colors text-sm'>
                                Privacy Policy
                            </Link>
                            <Link to='/terms' className='text-gray-400 hover:text-orange-500 transition-colors text-sm'>
                                Terms & Conditions
                            </Link>
                            <Link to='/contact' className='text-gray-400 hover:text-orange-500 transition-colors text-sm'>
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ModernFooter;
