import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">Roster Flow</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern solution for student team management.
              Streamline collaboration and organization with our intuitive platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-indigo-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/members" className="text-gray-400 hover:text-indigo-400 transition-colors">View Members</a>
              </li>
              <li>
                <a href="/add" className="text-gray-400 hover:text-indigo-400 transition-colors">Add Member</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center text-gray-500">
          &copy; {currentYear} Roster Flow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;