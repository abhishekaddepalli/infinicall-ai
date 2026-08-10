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