import React, { useState } from 'react';
import { BiCart, BiMinus, BiPlus, BiPlusCircle } from "react-icons/bi";
import { useCart } from "../../context/CartContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const FoodSingleCard = ({ food }) => {
    const { addToCart, removeFromCart, cartItems } = useCart();

    const itemInCart = cartItems.find(item => item._id === food._id);
    const quantity = itemInCart ? itemInCart.quantity : 0;

    const handleAddToCart = () => {
        addToCart(food);
        toast.success(`${food.name} added to cart!`, {
            icon: '🛒',
            style: {
                borderRadius: '12px',
                background: '#fff',
                color: '#363636',
            },
        });
    };

    const handleRemoveFromCart = () => {
        removeFromCart(food._id);
        toast.success(`${food.name} removed from cart`);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4 }
        },
        hover: { 
            y: -4,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="m-4"
        >
            <Card className="group relative overflow-hidden h-full flex flex-col bg-white border border-gray-200 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100">
                    <motion.img 
                        className="object-cover w-full h-64 lg:h-72 transition-transform duration-500"
                        src={food.image} 
                        alt={food.name}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="success" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-green-700 border-green-200">
                            Fresh
                        </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                        <Badge variant="destructive" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-red-700 border-red-200">
                            Popular
                        </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 right-4">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
                            <span className="text-2xl font-bold text-gray-900">
                                ${(food.priceInCents / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex-1 mb-4">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                            {food.name}
                        </h2>
                        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★★★★★</span>
                            </div>
                            <span>•</span>
                            <span>4.8 Rating</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                        {quantity > 0 && (
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={handleRemoveFromCart}
                                    className="rounded-lg h-9 w-9"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="px-3 py-1 bg-gray-50 rounded-lg min-w-[40px] text-center border border-gray-200">
                                    <span className="text-base font-semibold text-gray-900">{quantity}</span>
                                </div>
                            </div>
                        )}
                
                        <Button 
                            onClick={handleAddToCart}
                            className={`flex-1 gap-2 bg-orange-500 hover:bg-orange-600 ${quantity > 0 ? '' : 'w-full'}`}
                        >
                            {quantity > 0 ? (
                                <>
                                    <Plus className="h-4 w-4" />
                                    <span>Add More</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default FoodSingleCard;
