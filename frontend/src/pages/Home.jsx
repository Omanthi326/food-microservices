import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import { Search, Clock, Star, Users, ChefHat, Award, Phone, Mail, MapPin, Play, Apple, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import junkImage from '../assets/junk.jpg.png';
import foodCollageImage from '../assets/food-collage.jpg.jpg';
import food2Image from '../assets/food2.png';
import food1Image from '../assets/food1.png';
import cus1Image from '../assets/cus1.jpg';
import cus2Image from '../assets/cus2.jpg';

// Custom hook for counting animation
const useCountUp = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    let startTime = null;
                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        const currentCount = Math.floor(progress * (end - start) + start);
                        setCount(currentCount);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        const element = document.getElementById('stats-section');
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [end, duration, start, hasStarted]);

    return count;
};

// Component for counting animation with number formatting
const CountUpNumber = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const countRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    let startTime = null;
                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentCount = Math.floor(easeOutQuart * end);
                        setCount(currentCount);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current);
            }
        };
    }, [end, duration, hasStarted]);

    return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

// Stats Section Component
const StatsSection = () => {
    return (
        <section id="stats-section" className='py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden'>
            <div 
                className='absolute inset-0 opacity-10'
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>
            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                    {[
                        { icon: Users, value: 8800, suffix: '+', label: 'Customer Served' },
                        { icon: ChefHat, value: 9, suffix: '+', label: 'Experience Chef' },
                        { icon: Users, value: 5400, suffix: '+', label: 'Happy Customer' },
                        { icon: Award, value: 2, suffix: '+', label: 'Winning Award' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className='text-center'
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className='inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border-2 border-orange-500 bg-transparent'>
                                <stat.icon className='h-10 w-10 text-orange-500' strokeWidth={1.5} />
                            </div>
                            <div className='text-4xl md:text-5xl font-bold mb-2 text-white'>
                                <CountUpNumber end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className='text-gray-300 text-sm md:text-base'>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All Food');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Hero slides data
    const heroSlides = [
        {
            subtitle: "Satisfy Your Cravings",
            title: "Delicious Foods With",
            title2: "Wonderful Eating",
            description: "Experience the finest culinary delights crafted with passion and excellence.",
            image: junkImage,
            bgEmoji: "🍅"
        },
        {
            subtitle: "Fresh & Healthy",
            title: "Premium Quality",
            title2: "Every Single Bite",
            description: "We source the freshest ingredients to bring you exceptional flavors.",
            image: food2Image,
            bgEmoji: "🥗"
        },
        {
            subtitle: "Fast Delivery",
            title: "Quick & Hot",
            title2: "To Your Doorstep",
            description: "Your favorite meals delivered fast, hot, and ready to enjoy.",
            image: food1Image,
            bgEmoji: "🚀"
        },
        {
            subtitle: "Taste the Difference",
            title: "Authentic Flavors",
            title2: "Made with Love",
            description: "Traditional recipes perfected over generations, now on your table.",
            image: foodCollageImage,
            bgEmoji: "❤️"
        }
    ];

    // Auto-play carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Navigation functions
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const categories = ['All Food', 'Burger', 'Chicken', 'Pizza', 'Dessert'];

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:3000/food')
            .then((response) => {
                setFood(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    // Handle hash navigation on page load
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, []);

    const filteredFood = food.filter(item => {
        const matchesCategory = selectedCategory === 'All Food' || 
            item.name.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredFood = food.slice(0, 4);
    const testimonialFood = food.slice(0, 2);

    const handleSearch = (e) => {
        e.preventDefault();
            const menuSection = document.getElementById('menu-section');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
    };

  return (
        <div className='min-h-screen bg-white'>
        {/* Hero Section */}
            <section className='relative text-white overflow-hidden min-h-[600px] flex items-center'>
                {/* Dynamic Background Image per slide */}
                <motion.div 
                    key={`bg-${currentSlide}`}
                    className='absolute inset-0'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        backgroundImage: `url(${heroSlides[currentSlide].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Dark Overlay for text readability */}
                    <div className='absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/70 to-slate-900/80'></div>
                </motion.div>
                
                {/* Background Pattern Overlay */}
                <div 
                    className='absolute inset-0 opacity-10'
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                {/* Decorative Elements - Left Side - Dynamic per slide */}
                <motion.div
                    key={currentSlide}
                    className='absolute top-20 left-10 opacity-30'
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                        opacity: 0.3
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <div className='text-6xl'>{heroSlides[currentSlide].bgEmoji}</div>
                </motion.div>

                <motion.div
                    className='absolute bottom-20 left-10 opacity-30 flex gap-4'
                    animate={{ 
                        y: [0, -10, 0],
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <div className='text-4xl'>🍃</div>
                    <div className='text-4xl'>🌿</div>
                </motion.div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className='absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110'
                    aria-label="Previous slide"
                >
                    <ChevronLeft className='w-6 h-6 text-white' />
                </button>
                            <button 
                    onClick={nextSlide}
                    className='absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110'
                    aria-label="Next slide"
                >
                    <ChevronRight className='w-6 h-6 text-white' />
                </button>

                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full'>
                    <div className='grid lg:grid-cols-2 gap-12 items-center relative'>
                        {/* Left Content - Sliding */}
                        <motion.div 
                            key={currentSlide}
                            className='space-y-6 z-10'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Handwritten Style Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className='text-orange-500 text-xl md:text-2xl font-medium'
                                style={{ fontFamily: 'cursive' }}
                            >
                                {heroSlides[currentSlide].subtitle}
                            </motion.p>

                            {/* Main Headline */}
                            <motion.h1 
                                className='text-4xl md:text-5xl lg:text-7xl font-bold leading-tight'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {heroSlides[currentSlide].title}
                                <span className='block mt-2'>{heroSlides[currentSlide].title2}</span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p 
                                className='text-gray-300 text-lg leading-relaxed max-w-xl'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {heroSlides[currentSlide].description}
                            </motion.p>

                            {/* Search Bar */}
                            <motion.form 
                                onSubmit={handleSearch} 
                                className='flex gap-3 mt-8'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Input 
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 h-14 text-lg"
                                />
                                <Button 
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 px-8 h-14 text-lg font-semibold"
                                >
                                    Search
                                </Button>
                            </motion.form>
                        </motion.div>

                        {/* Right Image Section - Sliding */}
                        <motion.div 
                            key={`image-${currentSlide}`}
                            className='relative h-full min-h-[600px]'
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Curved White Shape - Top */}
                            <div className='absolute top-0 right-0 w-full h-64 bg-white rounded-br-[100px] opacity-10'></div>
                            
                            {/* Curved Dark Shape - Bottom */}
                            <div className='absolute bottom-0 left-0 w-full h-64 bg-slate-900 rounded-tl-[100px] opacity-30'></div>

                            {/* Food Image Container */}
                            <div className='relative z-10 h-full flex items-center justify-center p-4'>
                                <div className='relative w-full max-w-2xl'>
                                    {/* Circular Food Image Container */}
                                    <motion.div
                                        className='relative flex items-center justify-center'
                                        whileHover={{ scale: 1.05 }}
                                        key={`circle-${currentSlide}`}
                                        initial={{ scale: 0.8, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {/* Circular Food Image */}
                                        <div className='relative w-96 h-96 md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl ring-4 ring-white/80 z-10'>
                                            <motion.img 
                                                src={heroSlides[currentSlide].image} 
                                                alt={heroSlides[currentSlide].title}
                                                className="w-full h-full object-cover"
                                                initial={{ scale: 1.2 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            {/* Gradient Overlay */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none'></div>
                                        </div>
                                        
                                        {/* Decorative Animated Circle Ring - Outer */}
                                        <motion.div
                                            className='absolute rounded-full border-4 border-white/50 z-0'
                                            style={{
                                                width: '450px',
                                                height: '450px'
                                            }}
                                            animate={{
                                                scale: [1, 1.15, 1],
                                                opacity: [0.2, 0.5, 0.2]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>

                                    {/* Decorative Mint Leaves - Top Right */}
                                    <motion.div
                                        className='absolute top-4 right-4 text-4xl opacity-40'
                                        animate={{ 
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 4, 
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        🌿
                                    </motion.div>

                                    {/* Decorative Parsley - Bottom Right */}
                                    <motion.div
                                        className='absolute bottom-4 right-8 text-3xl opacity-40'
                                        animate={{ 
                                            rotate: [0, -15, 15, 0],
                                            y: [0, -5, 0]
                                        }}
                                        transition={{ 
                                            duration: 3, 
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        🌿
                                    </motion.div>

                                    {/* Background Food Items */}
                                    <div className='absolute -left-20 -bottom-10 opacity-20'>
                                        <div className='flex gap-4'>
                                            <div className='w-32 h-32 bg-orange-200 rounded-full flex items-center justify-center text-6xl'>
                                                🍗
                                            </div>
                                            <div className='w-32 h-32 bg-green-200 rounded-full flex items-center justify-center text-6xl mt-8'>
                                                🥗
                        </div>
                    </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orange Curved Line */}
                            <motion.svg
                                className='absolute top-1/2 right-0 w-full h-full opacity-30'
                                viewBox="0 0 200 200"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: 1 }}
                            >
                                <motion.path
                                    d="M 50 100 Q 100 50 150 100 T 250 100"
                                    fill="none"
                                    stroke="orange"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </motion.svg>
                        </motion.div>
                    </div>
                </div>

                {/* Slide Indicators (Dots) */}
                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3'>
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'bg-orange-500 w-10 h-3'
                                    : 'bg-white/50 w-3 h-3 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Daily Offer Section */}
            <section className='py-16 bg-green-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div 
                        className='text-center mb-12'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>
                            Daily Offer
                        </h2>
                        <p className='text-xl text-orange-600 font-semibold mb-4'>Up To 75% Off For This Day</p>
                        <div className='w-24 h-1 bg-orange-500 mx-auto rounded-full'></div>
                    </motion.div>

                    <div className='grid md:grid-cols-3 gap-6'>
                        {featuredFood.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className='relative overflow-hidden group hover:shadow-xl transition-shadow'>
                                    <div className='relative'>
                                        <img src={item.image} alt={item.name} className='w-full h-64 object-cover' />
                                        <div className='absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm'>
                                            50% OFF
                                        </div>
                                    </div>
                                    <CardContent className='p-6'>
                                        <h3 className='text-xl font-bold text-gray-900 mb-2'>{item.name}</h3>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-1 text-yellow-500'>
                                                <Star className='h-4 w-4 fill-yellow-500' />
                                                <span className='text-sm text-gray-600'>4.8</span>
                                            </div>
                                            <span className='text-2xl font-bold text-gray-900'>
                                                ${(item.priceInCents / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Food Menu Section */}
            <section id="menu-section" className='py-16 bg-orange-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div 
                        className='text-center mb-12'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className='text-sm font-semibold text-orange-600 mb-2'>Food Menu</h3>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Popular Delicious Foods
                        </h2>
                        <div className='w-24 h-1 bg-orange-500 mx-auto rounded-full'></div>
                    </motion.div>

                    {/* Category Filters */}
                    <div className='flex flex-wrap justify-center gap-4 mb-12'>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    selectedCategory === category
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Food Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner />
                        </div>
                    ) : (
                        <FoodCard food={filteredFood} />
                    )}
                </div>
            </section>

            {/* Special Offers Banners */}
            <section className='py-16 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <motion.div
                            className='bg-green-100 rounded-2xl p-8 md:p-12 relative overflow-hidden'
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className='text-sm font-semibold text-green-700 mb-2'>Daily Best Seller</h3>
                            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Fried Chicken</h2>
                            <p className='text-gray-600 mb-6 max-w-md'>
                                Crispy and delicious fried chicken made with secret spices and premium quality ingredients.
                            </p>
                            <Button className='bg-green-600 hover:bg-green-700'>
                                Shop Now
                            </Button>
                            <div className='absolute right-0 bottom-0 w-48 h-48 bg-green-200 rounded-full -mr-24 -mb-24 opacity-50'></div>
                            <div className='absolute right-8 bottom-8 text-8xl opacity-20'>🍗</div>
                        </motion.div>

                        <motion.div
                            className='bg-pink-100 rounded-2xl p-8 md:p-12 relative overflow-hidden'
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className='text-sm font-semibold text-pink-700 mb-2'>Daily Offer</h3>
                            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Hyderabadi Biryani</h2>
                            <p className='text-gray-600 mb-6 max-w-md'>
                                Authentic Hyderabadi biryani with aromatic spices and tender meat, a perfect blend of flavors.
                            </p>
                            <Button className='bg-pink-600 hover:bg-pink-700'>
                                Shop Now
                            </Button>
                            <div className='absolute right-0 bottom-0 w-48 h-48 bg-pink-200 rounded-full -mr-24 -mb-24 opacity-50'></div>
                            <div className='absolute right-8 bottom-8 text-8xl opacity-20'>🍛</div>
                        </motion.div>
            </div>
        </div>
            </section>

            {/* Easy To Order Section */}
            <section className='py-20 relative overflow-hidden min-h-[600px] flex items-center'>
                {/* Dark Blurred Background Image */}
                <div 
                    className='absolute inset-0'
                    style={{
                        backgroundImage: `url(${foodCollageImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Dark Overlay with Blur Effect */}
                    <div className='absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85 backdrop-blur-md'></div>
                </div>
                
                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='grid lg:grid-cols-2 gap-12 items-center'>
                        {/* Left Side - Text and Buttons */}
                        <motion.div 
                            className='space-y-6 z-10'
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Cashback Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <span className='inline-block bg-orange-500 text-white px-6 py-2.5 rounded-full text-base font-semibold'>
                                    $5.00 Cashback
                                </span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h2 
                                className='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Easy To Order Our All Food
                            </motion.h2>

                            {/* Buttons */}
                            <motion.div 
                                className='flex flex-col sm:flex-row gap-4 mt-8'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Button className='bg-white text-slate-900 hover:bg-gray-100 px-6 py-3.5 text-base font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg'>
                                    <Play className='h-5 w-5' />
                                    Available on the Google Play
                                </Button>
                                <Button className='bg-white text-slate-900 hover:bg-gray-100 px-6 py-3.5 text-base font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg'>
                                    <Apple className='h-5 w-5' />
                                    Download on the App Store
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Food Images Grid (2x2) */}
                        <motion.div 
                            className='grid grid-cols-2 gap-4 z-10'
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {featuredFood.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    className='relative overflow-hidden rounded-lg h-56'
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section / About Section */}
            <section id="about-section" className='py-16 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div 
                        className='text-center mb-12'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className='text-sm font-semibold text-gray-600 mb-2'>Testimonial</h3>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Our Customer Feedbacks
                        </h2>
                        <div className='w-24 h-1 bg-orange-500 mx-auto rounded-full'></div>
                    </motion.div>

                    <div className='grid md:grid-cols-2 gap-8'>
                        {[
                            {
                                id: 1,
                                name: 'Ann Mariya',
                                location: 'Sri Lanka',
                                image: cus1Image,
                                feedback: 'Excellent food quality and fast delivery service. I love ordering from here regularly. The flavors are authentic and the presentation is amazing!',
                                rating: 5
                            },
                            {
                                id: 2,
                                name: 'John Smith',
                                location: 'New York, USA',
                                image: cus2Image,
                                feedback: 'The best food delivery experience I\'ve ever had! Fresh ingredients, delicious meals, and always delivered on time. Highly recommended!',
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className='p-8 hover:shadow-xl transition-shadow'>
                                    <div className='flex items-center gap-4 mb-4'>
                                        <div className='w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-orange-200'>
                                            <img 
                                                src={testimonial.image} 
                                                alt={testimonial.name}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div>
                                            <h4 className='font-bold text-gray-900'>{testimonial.name}</h4>
                                            <p className='text-sm text-gray-600'>{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <p className='text-gray-600 mb-4 leading-relaxed'>
                                        "{testimonial.feedback}"
                                    </p>
                                    <div className='flex gap-1 text-yellow-500'>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className='h-5 w-5 fill-yellow-500' />
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection />
        </div>
    );
};

export default Home;
