import React from 'react';
import logoImage from '../assets/logo .png';

const ModernLogo = ({ size = 'default', showText = true, className = '' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        default: 'w-20 h-20',
        large: 'w-28 h-28',
        xl: 'w-32 h-32'
    };

    const textSizes = {
        small: 'text-lg',
        default: 'text-2xl',
        large: 'text-3xl',
        xl: 'text-4xl'
    };

    return (
        <div className={`flex items-center space-x-3 group ${className}`}>
            {/* Logo Image */}
            <div className='relative'>
                <img 
                    src={logoImage} 
                    alt="Logo" 
                    className={`${sizeClasses[size]} object-contain transition-all duration-300 group-hover:scale-110`}
                />
            </div>
            
            {/* Logo Text */}
            {showText && (
                <div className='flex flex-col'>
                    <span className={`${textSizes[size]} font-bold text-orange-500 leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`}>
                        QDeli
                    </span>
                    <span className={`${size === 'small' ? 'text-xs' : 'text-xs'} text-gray-600 font-medium -mt-1`}>
                        Food Delivery
                    </span>
                </div>
            )}
        </div>
    );
};

export default ModernLogo;
