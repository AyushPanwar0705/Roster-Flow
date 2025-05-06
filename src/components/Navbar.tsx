import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Home, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-800' : 'bg-transparent'
  } py-4`;

  const links = [
    { path: '/', icon: <Home size={20} />, text: 'Home' },
    { path: '/members', icon: <Users size={20} />, text: 'View Members' },
    { path: '/add', icon: <UserPlus size={20} />, text: 'Add Member' },
  ];

  return (
    <>
      <header className={navbarClasses}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Users size={28} className="text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              Roster Flow
            </span>
          </Link>

          <nav className="hidden md:flex space-x-6 items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-800'
                }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={toggleMenu} 
            className="md:hidden text-gray-300 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                    location.pathname === link.path
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;