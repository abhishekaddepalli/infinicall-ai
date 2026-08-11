'use strict';

const express = require('express');
const router = express.Router();
const leadIntelligenceController = require('../controllers/lead-intelligence.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/analyze-lead', authenticate, leadIntelligenceController.analyzeLead);

module.exports = router;
