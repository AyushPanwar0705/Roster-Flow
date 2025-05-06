import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { addMember } from '../services/api';

const AddMember = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.role || !formData.email) {
      setAlert({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    if (!image) {
      setAlert({
        type: 'error',
        message: 'Please upload a profile image.',
      });
      return;
    }

    setIsSubmitting(true);
    setAlert({ type: null, message: '' });

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('bio', formData.bio);
      if (image) {
        submitData.append('profileImage', image);
      }

      // Call API service to add member
      const response = await addMember(submitData);
      
      setAlert({
        type: 'success',
        message: 'Team member added successfully!',
      });

      // Reset form
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        bio: '',
      });
      setImage(null);
      setImagePreview(null);

      // Redirect after short delay
      setTimeout(() => {
        navigate('/members');
      }, 2000);
    } catch (error) {
      console.error('Error adding member:', error);
      setAlert({
        type: 'error',
        message: 'Failed to add team member. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <UserPlus size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold">Add Team Member</h1>
        </div>

        {alert.type && (
          <div 
            className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
              alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <p>{alert.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Smith"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g. Developer, Designer, Project Manager"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief description about the team member"
              className="form-input min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image <span className="text-red-500">*</span></label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload size={24} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <label 
                  htmlFor="profileImage" 
                  className="btn btn-secondary cursor-pointer inline-flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  {image ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG or GIF (max 2MB)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus size={18} className="mr-2" />
                  Add Member
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddMember;