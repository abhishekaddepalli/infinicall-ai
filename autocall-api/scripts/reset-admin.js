'use strict';

require('dotenv').config({ path: '../.env' });
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autocall';

(async () => {
  try {
    const args = process.argv.slice(2);
    const email = args[0] ? args[0].toLowerCase().trim() : 'admin@example.com';
    const password = args[1] || 'Admin@123456';

    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const { db } = require('../models');

    let superAdminRole = await db.Role.findOne({ name: 'super_admin' });
    if (!superAdminRole) {
      superAdminRole = await db.Role.create({
        name: 'super_admin',
        description: 'Super Administrator with full access',
        system_reserved: true
      });
      console.log('✅ Created super_admin role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await db.User.findOne({ email });

    if (!user) {
      user = await db.User.create({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        roleId: superAdminRole._id,
        role: 'super_admin',
        isVerified: true,
        isActive: true
      });
      console.log(`\n🎉 New Super Admin Created Successfully!`);
    } else {
      user.password = hashedPassword;
      user.roleId = superAdminRole._id;
      user.role = 'super_admin';
      user.isActive = true;
      user.isVerified = true;
      await user.save();
      console.log(`\n🎉 Admin Credentials Updated Successfully!`);
    }

    console.log(`-----------------------------------`);
    console.log(`Email    : ${user.email}`);
    console.log(`Password : ${password}`);
    console.log(`Role     : super_admin`);
    console.log(`Status   : Active & Verified`);
    console.log(`-----------------------------------\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting admin:', err.message);
    process.exit(1);
  }
})();
