'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/permission');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/', authenticate, dashboardController.getAdminDashboardData);
router.get('/user', authenticate, dashboardController.getUserDashboardData);
router.get('/team-member', authenticate, dashboardController.getTeamMemberDashboardData);

module.exports = router;
