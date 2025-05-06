import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.VITE_CLIENT_URL || 'http://localhost:5173', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/api/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// MongoDB connection with enhanced error handling
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/team-management';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Define Member schema and model
const memberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String 
  },
  bio: { 
    type: String 
  },
  profileImage: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true
});

const Member = mongoose.model('Member', memberSchema);

// API Routes

// GET all members
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
});

// GET member by ID
app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Error fetching member', error: error.message });
  }
});

// POST new member with enhanced error handling
app.post('/api/members', upload.single('profileImage'), async (req, res) => {
  try {
    // Log request details for debugging
    console.log('Received member creation request:', {
      body: req.body,
      file: req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const { name, role, email, phone, bio } = req.body;
    
    // Enhanced validation
    const requiredFields = { name, role, email };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Create new member
    const newMember = new Member({
      name,
      role,
      email,
      phone,
      bio,
      profileImage: path.basename(req.file.path)
    });

    // Save to database
    const savedMember = await newMember.save();
    
    // Log successful creation
    console.log('Member created successfully:', savedMember);
    
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating member:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ message: 'Error creating member', error: error.message });
  }
});

// Error handling middleware with detailed error responses
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File is too large. Maximum size is 2MB' 
      });
    }
    return res.status(400).json({ 
      message: 'File upload error', 
      error: err.message 
    });
  }

  // Handle other errors
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start the server with enhanced logging
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`CORS origin: ${process.env.VITE_CLIENT_URL || 'http://localhost:5173'}`);
});