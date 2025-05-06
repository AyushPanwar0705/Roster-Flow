import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
          <Sparkles size={32} className="text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Student Team Management
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Streamline your team workflow with our intuitive platform. 
          Easily add members, view profiles, and manage your student team in one place.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mt-4"
      >
        <Link 
          to="/add" 
          className="btn btn-primary px-8 py-3 text-lg flex items-center justify-center space-x-2"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </Link>
        <Link 
          to="/members" 
          className="btn btn-secondary px-8 py-3 text-lg flex items-center justify-center space-x-2"
        >
          <Users size={20} />
          <span>View Members</span>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        {features.map((feature, index) => (
          <div 
            key={index}
            className="card p-6 text-center hover:translate-y-[-4px]"
          >
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-20 bg-blue-50 p-8 rounded-2xl max-w-3xl mx-auto w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Get Started Today</h2>
        <p className="text-center text-gray-700 mb-6">
          Managing your student team has never been easier. Add your first team member now!
        </p>
        <div className="flex justify-center">
          <Link to="/add" className="btn btn-accent">
            Add Your First Member
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Add Members",
    description: "Easily add new team members with detailed profiles and photos.",
    icon: <UserPlus size={24} className="text-blue-500" />
  },
  {
    title: "View Team",
    description: "See all team members at a glance with a clean, organized interface.",
    icon: <Users size={24} className="text-blue-500" />
  },
  {
    title: "Member Details",
    description: "Access comprehensive information about each team member.",
    icon: <Sparkles size={24} className="text-blue-500" />
  }
];

export default Home;