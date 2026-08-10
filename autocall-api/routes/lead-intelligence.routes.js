'use strict';

const express = require('express');
const router = express.Router();
const leadIntelligenceController = require('../controllers/lead-intelligence.controller');
const { verifyToken } = require('../middlewares/authJwt');

router.post('/analyze-lead', verifyToken, leadIntelligenceController.analyzeLead);

module.exports = router;
