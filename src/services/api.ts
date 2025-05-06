import axios from 'axios';
import { Member } from '../types/Member';

// Set base URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and better error handling
  timeout: 10000, // 10 seconds
  validateStatus: (status) => status >= 200 && status < 500, // Don't reject if status is 2xx|3xx|4xx
});

// Get all members
export const getAllMembers = async (): Promise<Member[]> => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw handleApiError(error);
  }
};

// Get member by ID
export const getMemberById = async (id: string): Promise<Member> => {
  try {
    const response = await api.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member with ID ${id}:`, error);
    throw handleApiError(error);
  }
};

// Add new member (with image upload)
export const addMember = async (formData: FormData): Promise<Member> => {
  try {
    // Log the API URL being used
    console.log('API URL:', API_URL);
    
    // Log FormData contents for debugging (excluding file binary data)
    console.log('FormData contents:', Object.fromEntries(formData.entries()));

    const response = await api.post('/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add progress tracking for large files
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
        console.log('Upload progress:', percentCompleted, '%');
      },
    });
    
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('Error adding member:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      config: axios.isAxiosError(error) ? {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      } : null,
      response: axios.isAxiosError(error) ? {
        status: error.response?.status,
        data: error.response?.data,
      } : null,
    });
    
    throw handleApiError(error);
  }
};

// Enhanced API error handler
export const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    // Network Error
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timed out. Please check your connection and try again.');
    }
    if (!error.response) {
      return new Error('Network error. Please check if the server is running and accessible.');
    }
    
    // Server Errors
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 400:
        return new Error(`Invalid request: ${message}`);
      case 404:
        return new Error('Resource not found');
      case 413:
        return new Error('File size too large. Please upload a smaller image.');
      case 415:
        return new Error('Unsupported file type. Please upload a valid image file.');
      case 422:
        return new Error(`Validation error: ${message}`);
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(`Request failed: ${message}`);
    }
  }
  
  // Generic error
  return new Error('An unexpected error occurred. Please try again.');
};

export default api;