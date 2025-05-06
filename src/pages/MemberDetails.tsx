import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMemberById } from '../services/api';
import { Member } from '../types/Member';

const MemberDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMemberDetails(id);
    }
  }, [id]);

  const fetchMemberDetails = async (memberId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getMemberById(memberId);
      setMember(data);
    } catch (err) {
      console.error('Error fetching member details:', err);
      setError('Failed to load member details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-500 mr-2" size={24} />
        <span className="text-gray-600">Loading member details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg">
        <p className="font-medium mb-3">Error: {error}</p>
        <div className="flex space-x-4">
          <button 
            onClick={() => id && fetchMemberDetails(id)}
            className="btn btn-secondary"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/members')}
            className="btn btn-primary"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <User className="mx-auto text-gray-400" size={48} />
        <h3 className="mt-4 text-xl font-medium text-gray-700">Member not found</h3>
        <p className="mt-2 text-gray-500">The requested team member could not be found</p>
        <button 
          onClick={() => navigate('/members')}
          className="mt-4 btn btn-primary"
        >
          View All Members
        </button>
      </div>
    );
  }

  // Format join date
  const formattedDate = member.createdAt 
    ? new Date(member.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div>
      <button 
        onClick={() => navigate('/members')} 
        className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to Members</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:flex-shrink-0"
          >
            <div className="h-64 w-full md:w-64 md:h-auto bg-gray-200">
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
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 md:p-8"
          >
            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
              {member.role}
            </div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {member.name}
            </h1>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-2" />
                <a href={`mailto:${member.email}`} className="text-gray-700 hover:text-blue-500">
                  {member.email}
                </a>
              </div>
              
              {member.phone && (
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-500 mr-2" />
                  <a href={`tel:${member.phone}`} className="text-gray-700 hover:text-blue-500">
                    {member.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700">Joined: {formattedDate}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Bio</h2>
              <p className="text-gray-600 leading-relaxed">
                {member.bio || 'No bio available for this team member.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;