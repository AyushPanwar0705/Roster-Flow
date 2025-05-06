import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/team-management';

// Define Member schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  bio: { type: String },
  profileImage: { type: String, required: true }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

// Team members data
const teamMembers = [
  {
    name: 'Ayush Panwar',
    role: 'Full Stack Developer',
    email: 'ayush.panwar@example.com',
    phone: '+91 98765 43210',
    bio: 'Experienced full stack developer with expertise in React and Node.js. Passionate about creating scalable web applications.',
    profileImage: 'default-profile.jpg'
  },
  {
    name: 'Harhit Rustagi',
    role: 'Frontend Developer',
    email: 'harhit.rustagi@example.com',
    phone: '+91 98765 43211',
    bio: 'Frontend specialist with a keen eye for design and user experience. Skilled in React and modern CSS frameworks.',
    profileImage: 'default-profile.jpg'
  },
  {
    name: 'Siddharth Patni',
    role: 'Backend Developer',
    email: 'siddharth.patni@example.com',
    phone: '+91 98765 43212',
    bio: 'Backend developer focused on building robust and efficient server-side applications. Expert in Node.js and MongoDB.',
    profileImage: 'default-profile.jpg'
  }
];

// Connect to MongoDB and seed data
async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing members
    await Member.deleteMany({});
    console.log('Cleared existing members');

    // Insert new members
    const result = await Member.insertMany(teamMembers);
    console.log('Added team members:', result);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
seedData();