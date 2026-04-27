import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const TopBar = () => {
    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-slate-800 text-gray-300 py-2 text-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                    {/* Contact Info */}
                    <div className='flex flex-wrap items-center gap-4 md:gap-6'>
                        <a href='mailto:welcome@regfood.com' className='flex items-center gap-2 hover:text-orange-500 transition-colors'>
                            <Mail className='h-4 w-4' />
                            <span>welcome@regfood.com</span>
                        </a>
                        <a href='tel:+012345678901' className='flex items-center gap-2 hover:text-orange-500 transition-colors'>
                            <Phone className='h-4 w-4' />
                            <span>012345678901</span>
                        </a>
                    </div>

                    {/* Social Media */}
                    <div className='flex items-center gap-3'>
                        <a href='#' className='hover:text-orange-500 transition-colors' aria-label='Facebook'>
                            <Facebook className='h-4 w-4' />
                        </a>
                        <a href='#' className='hover:text-orange-500 transition-colors' aria-label='Twitter'>
                            <Twitter className='h-4 w-4' />
                        </a>
                        <a href='#' className='hover:text-orange-500 transition-colors' aria-label='Instagram'>
                            <Instagram className='h-4 w-4' />
                        </a>
                        <a href='#' className='hover:text-orange-500 transition-colors' aria-label='YouTube'>
                            <Youtube className='h-4 w-4' />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

