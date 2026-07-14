import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

/**
 * Creates an admin user or promotes an existing user to admin.
 *
 * Usage:
 *   node seeds/createAdmin.js                     → creates admin@zylook.com
 *   node seeds/createAdmin.js promote user@email   → promotes existing user
 */
const createAdmin = async () => {
  try {
    await connectDB();

    const action = process.argv[2]; // 'promote' or undefined
    const email = process.argv[3]; // email to promote

    if (action === 'promote' && email) {
      // Promote existing user
      const user = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true }
      );
      if (!user) {
        console.error(`❌ No user found with email: ${email}`);
        process.exit(1);
      }
      console.log(`✅ User promoted to admin: ${user.name} (${user.email})`);
    } else {
      // Create fresh admin user
      const existingAdmin = await User.findOne({ email: 'admin@zylook.com' });
      if (existingAdmin) {
        console.log('⚠️  Admin user already exists. Updating role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Admin user updated: ${existingAdmin.email}`);
      } else {
        const admin = await User.create({
          name: 'Zylook Admin',
          email: 'admin@zylook.com',
          password: 'admin123',
          role: 'admin',
          isEmailVerified: true,
        });
        console.log(`✅ Admin user created:`);
        console.log(`   Email:    ${admin.email}`);
        console.log(`   Password: admin123`);
        console.log(`   Role:     ${admin.role}`);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
