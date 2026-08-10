'use strict';

const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automation.controller');
const { verifyToken } = require('../middlewares/authJwt');

router.post('/n8n/test-trigger', verifyToken, automationController.testN8nWebhook);
router.post('/ai-generate-script', verifyToken, automationController.generateAiScript);
router.post('/send-post-call-upi', verifyToken, automationController.sendPostCallUpi);

module.exports = router;
