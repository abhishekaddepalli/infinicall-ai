'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const net = require('net');
const { fork } = require('child_process');

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function start() {
  const isPort27017Open = await checkPort(27017);

  if (!isPort27017Open) {
    console.log('⚡ Starting Embedded Local MongoDB Server on port 27017...');
    try {
      const mongod = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'autocall'
        }
      });
      console.log(`✅ Embedded MongoDB is running at: ${mongod.getUri()}`);
    } catch (mongoErr) {
      console.warn('Could not start MongoMemoryServer on 27017:', mongoErr.message);
    }
  } else {
    console.log('⚡ Using existing MongoDB instance on port 27017');
  }

  // Run seeders asynchronously
  try {
    console.log('🌱 Triggering Database Seeders in background...');
    fork('./seeders/index.js');
  } catch (seedErr) {
    console.warn('Seeder trigger error:', seedErr.message);
  }

  console.log('🚀 Booting Express API Server...');
  require('./server.js');
}

start().catch(console.error);
