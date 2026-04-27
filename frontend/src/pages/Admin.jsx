import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, BarChart3, Utensils, DollarSign, Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';

const Admin = () => {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='min-h-screen bg-white'>
      {loading && <Spinner/>}
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16'>
        {/* Header Section */}
        <motion.div 
          className='mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Food Management
          </h1>
          <p className='text-xl text-gray-600 mb-8'>Manage your restaurant's menu items</p>
          <div className='h-1 w-24 bg-orange-500 rounded-full mb-8'></div>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button 
              asChild
              size="lg"
              className='bg-orange-500 hover:bg-orange-600'
            >
              <Link to="/admin/food/create">
                <Plus className="h-5 w-5 mr-2" />
                Add New Item
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className='border-orange-500 text-orange-600 hover:bg-orange-50'
            >
              <Link to="/admin/dashboard">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className='border border-gray-200'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <Utensils className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>{food.length}</h3>
                    <p className='text-gray-600'>Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className='border border-gray-200'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      ${food.reduce((acc, item) => acc + (item.priceInCents / 100), 0).toFixed(2)}
                    </h3>
                    <p className='text-gray-600'>Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className='border border-gray-200'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <Star className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>4.8</h3>
                    <p className='text-gray-600'>Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Food Items Table */}
        <Card className='border border-gray-200'>
          <CardContent className='p-0'>
            <div className='p-6 border-b border-gray-200'>
              <h2 className='text-2xl font-bold text-gray-900'>Menu Items</h2>
              <p className='text-gray-600'>Manage your restaurant's menu</p>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-orange-50'>
                  <tr>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>#</th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Image</th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Name</th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Price</th>
                    <th className='py-4 px-6 text-center text-sm font-semibold text-gray-700'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {food.map((item, index) => (
                    <tr key={item._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='py-4 px-6 text-sm font-medium text-gray-900'>{index + 1}</td>
                      <td className='py-4 px-6'>
                        <div className='w-16 h-16 rounded-lg overflow-hidden shadow-md border border-gray-200'>
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
                          <p className='text-sm text-gray-500'>Menu Item</p>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='text-xl font-bold text-orange-600'>
                          ${(item.priceInCents / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='flex justify-center gap-2'>
                          <Button 
                            asChild
                            variant="outline"
                            size="sm"
                            className='border-orange-500 text-orange-600 hover:bg-orange-50'
                          >
                            <Link to={`/admin/food/edit/${item._id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            asChild
                            variant="outline"
                            size="sm"
                            className='border-red-500 text-red-600 hover:bg-red-50'
                          >
                            <Link to={`/admin/food/delete/${item._id}`}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {food.length === 0 && !loading && (
          <motion.div 
            className='text-center py-16'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='w-32 h-32 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center shadow-lg'>
              <Utensils className="h-16 w-16 text-orange-600" />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>No items found</h3>
            <p className='text-gray-600 mb-8'>Start by adding your first menu item!</p>
            <Button 
              asChild
              size="lg"
              className='bg-orange-500 hover:bg-orange-600'
            >
              <Link to="/admin/food/create">
                <Plus className="h-5 w-5 mr-2" />
                Add First Item
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
