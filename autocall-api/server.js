'use strict';

require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const deleteExpiredOtp = require('./cron/deleteExpiredOtps');
const { initTopUpExpiryCron } = require('./cron/topup-expiry.cron');

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

(async () => {
  try {
    console.log('Starting backend server initialization...');
    const app = require('./app');
    console.log('app.js loaded successfully');

    const server = http.createServer(app);
    console.log('HTTP server created');
    const io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || origin === 'null') return callback(null, true);

          const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [];
          if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL.trim());
          if (process.env.APP_URL) allowedOrigins.push(process.env.APP_URL.trim());

          if (origin.includes('localhost:') || origin.includes('127.0.0.1:')) {
            return callback(null, true);
          }

          if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(null, true);
          }
        },
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    deleteExpiredOtp.start();
    initTopUpExpiryCron();

    // Safe, non-destructive startup initialization (preserves all user settings, logos, and passwords)
    try {
      const { db } = require('./models');
      if (db && db.Setting) {
        const existingSetting = await db.Setting.findOne();
        if (!existingSetting) {
          await db.Setting.create({ app_name: 'InfiniCall AI' });
          console.log('✅ Default settings initialized');
        }
      }

      if (db && db.Role && db.User) {
        const bcrypt = require('bcryptjs');
        let superAdminRole = await db.Role.findOne({ name: 'super_admin' });
        if (!superAdminRole) {
          superAdminRole = await db.Role.create({
            name: 'super_admin',
            description: 'Super Administrator with full access',
            system_reserved: true
          });
        }

        let userRole = await db.Role.findOne({ name: 'user' });
        if (!userRole) {
          userRole = await db.Role.create({
            name: 'user',
            description: 'Standard Platform User',
            system_reserved: true
          });
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
        const adminUser = await db.User.findOne({ email: adminEmail });

        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          await db.User.create({
            name: process.env.ADMIN_NAME || 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            roleId: superAdminRole._id,
            role: 'super_admin',
            isVerified: true,
            isActive: true
          });
          console.log(`✅ Default admin created: ${adminEmail}`);
        }

        const defaultUserEmail = process.env.DEFAULT_USER_EMAIL || 'user@example.com';
        const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || 'User@123456';
        const normalUser = await db.User.findOne({ email: defaultUserEmail });

        if (!normalUser) {
          const hashedPassword = await bcrypt.hash(defaultUserPassword, 10);
          await db.User.create({
            name: process.env.DEFAULT_USER_NAME || 'Default User',
            email: defaultUserEmail,
            password: hashedPassword,
            roleId: userRole._id,
            role: 'user',
            isVerified: true,
            isActive: true
          });
          console.log(`✅ Default user created: ${defaultUserEmail}`);
        }
      }

      if (db && db.Plan) {
        const count = await db.Plan.countDocuments();
        if (count === 0) {
          await db.Plan.insertMany([
            {
              name: "Starter Plan",
              slug: "starter-plan",
              description: "Ideal for young startups and developers exploring Conversational AI calling options.",
              plan_type: "subscription",
              billing_cycle: "monthly",
              validity_days: 30,
              amount: 499,
              currency: "INR",
              total_credits: 500,
              status: "active",
              is_popular: false
            },
            {
              name: "Pro Scale Plan",
              slug: "pro-scale-plan",
              description: "Perfect for expanding teams requiring high-performance concurrent calling limits.",
              plan_type: "subscription",
              billing_cycle: "monthly",
              validity_days: 30,
              amount: 999,
              currency: "INR",
              total_credits: 1200,
              status: "active",
              is_popular: true
            },
            {
              name: "Enterprise Plan",
              slug: "enterprise-plan",
              description: "Tailored options for global corporations requiring dedicated trunk lines and SLAs.",
              plan_type: "subscription",
              billing_cycle: "monthly",
              validity_days: 30,
              amount: 4999,
              currency: "INR",
              total_credits: 7000,
              status: "active",
              is_popular: false
            },
            {
              name: "Credit Top-Up Pack",
              slug: "credit-top-up-pack",
              description: "Add extra calling credits to your account balance anytime.",
              plan_type: "top_up",
              billing_cycle: "one_time",
              validity_days: 90,
              amount: 299,
              currency: "INR",
              total_credits: 300,
              status: "active",
              is_popular: false
            }
          ]);
          console.log('✅ Default plans auto-seeded into MongoDB');
        }
      }
    } catch (migErr) {
      console.error('Setting migration error:', migErr);
    }

    app.set('io', io);

    const { WebSocketServer } = require('ws');
    const wss = new WebSocketServer({ server, path: '/' });
    const voiceAutomationService = require('./services/voiceAutomationService');

    wss.on('connection', (ws) => {
      console.log('Twilio Media Stream WebSocket connected');
      voiceAutomationService.handleMediaStream(ws);
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();