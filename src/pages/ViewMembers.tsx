import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, User, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllMembers } from '../services/api';
import { Member } from '../types/Member';

const ViewMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (members.length > 0) {
      setFilteredMembers(
        members.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAllMembers();
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load team members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Staggered animation for member cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 text-blue-500" size={28} />
            Team Members
          </h1>
          <p className="text-gray-600 mt-1">View all team members in one place</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-blue-500 mr-2" size={24} />
          <span className="text-gray-600">Loading team members...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchMembers}
            className="mt-2 text-sm text-red-700 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          {searchTerm ? (
            <div>
              <User className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-xl font-medium text-gray-700">No members match your search</h3>
              <p className="mt-2 text-gray-500">Try different search terms or clear the search</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 btn btn-secondary"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div>
              <User className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-xl font-medium text-gray-700">No team members yet</h3>
              <p className="mt-2 text-gray-500">Get started by adding your first team member</p>
              <Link to="/add" className="mt-4 btn btn-primary inline-flex items-center">
                <span>Add Member</span>
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredMembers.map((member) => (
              <motion.div 
                key={member._id} 
                variants={item}
                layout
                className="card hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || ''}/uploads/${member.profileImage}`} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {member.bio || 'Team member bio not available.'}
                  </p>
                  <Link
                    to={`/members/${member._id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium flex items-center text-sm mt-2"
                  >
                    <span>View Profile</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ViewMembers;