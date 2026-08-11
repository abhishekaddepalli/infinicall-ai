'use strict';

const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automation.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/n8n/test-trigger', authenticate, automationController.testN8nWebhook);
router.post('/ai-generate-script', authenticate, automationController.generateAiScript);
router.post('/send-post-call-upi', authenticate, automationController.sendPostCallUpi);

module.exports = router;
