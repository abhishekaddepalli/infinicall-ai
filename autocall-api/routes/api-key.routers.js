const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/api-key.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/permission');

router.use(authenticate);

router.post('/create', apiKeyController.create);
router.get('/', apiKeyController.getAll);
router.get('/self', apiKeyController.getSelf);
router.put('/:id/regenerate', apiKeyController.regenerate);
router.put('/:id/status', apiKeyController.updateStatus);
router.delete('/:id', apiKeyController.delete);
router.get('/:id', apiKeyController.getById);

module.exports = router;