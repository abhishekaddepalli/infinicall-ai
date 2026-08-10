'use strict';

require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const deleteExpiredOtp = require('./cron/deleteExpiredOtps');
const { initTopUpExpiryCron } = require('./cron/topup-expiry.cron');

const PORT = process.env.PORT || 3000;

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
          if (!origin) return callback(null, true);

          const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Socket.io CORS blocked: ' + origin));
          }
        },
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    deleteExpiredOtp.start();
    initTopUpExpiryCron();

    // Auto-migrate Setting collection branding in MongoDB
    try {
      const { db } = require('./models');
      if (db && db.Setting) {
        await db.Setting.updateMany({}, {
          $set: {
            app_name: 'InfiniCall AI'
          },
          $unset: {
            logo_light_url: "",
            logo_dark_url: "",
            sidebar_logo_url: "",
            landing_logo_url: "",
            mobile_logo_url: "",
            favicon_url: ""
          }
        });
        console.log('✅ Setting collection migrated to InfiniCall AI');
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

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();