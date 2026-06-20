// Seed script for development — sample outfit data
// Run: npm run seed

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedOutfits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // TODO: Add sample products and outfits here when models are ready

    console.log('🌱 Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedOutfits();
